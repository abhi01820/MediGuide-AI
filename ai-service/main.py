from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import spacy
from utils.ocr import extract_text
from utils.nlp import extract_health_data, analyze_health

app = FastAPI(title="MediGuide AI Service")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "MediGuide AI Service Running"}

@app.post("/analyze-report")
async def analyze_report(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        text = extract_text(contents, file.filename)
        
        if not text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from document.")
            
        health_data = extract_health_data(text)
        analysis_result = analyze_health(health_data)
        
        return {
            "status": "success",
            "extracted_text": text[:500] + "..." if len(text) > 500 else text, # snippet
            "raw_data": health_data,
            "analysis": analysis_result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chatbot")
async def chatbot_response(query: dict):
    # Basic rule-based chatbot endpoint
    user_text = query.get("text", "").lower()
    
    response = "I am the MediGuide AI assistant. How can I help you regarding your health reports?"
    
    if "sugar" in user_text or "glucose" in user_text or "diabetes" in user_text:
        response = "Your fasting glucose levels indicate your diabetes risk. A normal fasting glucose is under 100 mg/dL. If yours is higher, please consult a doctor."
    elif "blood pressure" in user_text or "bp" in user_text:
        response = "Normal blood pressure is usually around 120/80. High blood pressure can lead to hypertension. Reducing salt intake and regular exercise can help maintain healthy BP."
    elif "bmi" in user_text or "weight" in user_text:
        response = "BMI is calculated using your height and weight. A normal BMI is between 18.5 and 24.9. Maintaining a balanced diet and exercising regularly helps keep a healthy BMI."
    elif "hello" in user_text or "hi" in user_text:
        response = "Hello! I am MediGuide AI. You can ask me about your health reports like your BMI, blood pressure, or glucose levels."
        
    return {"response": response}
