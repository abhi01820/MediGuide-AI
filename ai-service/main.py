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

import os
import google.generativeai as genai
from dotenv import load_dotenv

# Try to load from backend/.env if it exists
load_dotenv(dotenv_path="../backend/.env")

@app.post("/chatbot")
async def chatbot_response(query: dict):
    user_text = query.get("text", "")
    
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return {"response": "To unlock advanced realistic conversations in any language, please get a free Gemini API Key from Google AI Studio (aistudio.google.com), and add GEMINI_API_KEY=your_key to your backend/.env file!"}
        
    try:
        genai.configure(api_key=api_key)
        # Use simple model
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        system_prompt = "You are MediGuide AI, a helpful, empathetic, and highly intelligent medical assistant. Keep responses clear, concise, and realistic. Reply in the exact same language the user speaks to you."
        
        # We can pass instructions via prompt engineering
        full_prompt = f"{system_prompt}\n\nUser: {user_text}\nAssistant:"
        
        response = model.generate_content(full_prompt)
        reply = response.text.replace("Assistant:", "").strip()
        
        return {"response": reply}
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return {"response": "I'm having a little trouble connecting to my AI brain right now. Please try again later."}
