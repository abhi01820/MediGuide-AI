import re
import spacy

try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("Warning: spacy en_core_web_sm not found.")
    nlp = None

def extract_health_data(text: str) -> dict:
    """
    Extracts key health parameters from the text.
    Handles common formats for Height, Weight, Blood Pressure, and Fasting Glucose.
    """
    data = {
        "height_cm": None,
        "weight_kg": None,
        "blood_pressure": None, # string format "120/80"
        "systolic": None,
        "diastolic": None,
        "fasting_glucose": None,
    }
    
    # Simple RegEx extraction
    text_lower = text.lower()
    
    # Extract Weight (e.g. Weight: 75 kg or 75kg)
    weight_match = re.search(r'weight[\s:]*([\d\.]+)\s*(kg|lbs?)', text_lower)
    if weight_match:
        val = float(weight_match.group(1))
        unit = weight_match.group(2)
        if 'lb' in unit:
            val = val * 0.453592 # convert to kg
        data["weight_kg"] = round(val, 2)
        
    # Extract Height (e.g. Height: 175 cm or 1.75 m)
    height_match = re.search(r'height[\s:]*([\d\.]+)\s*(cm|m)', text_lower)
    if height_match:
        val = float(height_match.group(1))
        unit = height_match.group(2)
        if unit == 'm':
            val = val * 100 # convert to cm
        data["height_cm"] = round(val, 2)
        
    # Extract Blood Pressure (e.g. BP: 120/80 or Blood Pressure: 120/80)
    bp_match = re.search(r'(?:bp|blood\s*pressure)[\s:]*(\d{2,3})\s*/\s*(\d{2,3})', text_lower)
    if bp_match:
        data["systolic"] = int(bp_match.group(1))
        data["diastolic"] = int(bp_match.group(2))
        data["blood_pressure"] = f"{data['systolic']}/{data['diastolic']}"
        
    # Extract Fasting Glucose (e.g. Fasting Glucose: 105 mg/dL or Sugar: 105)
    glucose_match = re.search(r'(?:fasting\s*glucose|glucose|sugar)[\s:]*([\d\.]+)\s*(?:mg/dl)?', text_lower)
    if glucose_match:
        data["fasting_glucose"] = float(glucose_match.group(1))
        
    return data

def analyze_health(data: dict) -> dict:
    """Calculates risks based on extracted parameters"""
    analysis = {
        "bmi": None,
        "bmi_status": None,
        "blood_pressure_status": None,
        "diabetes_risk": None,
        "summary": "",
        "recommendations": []
    }
    
    # BMI Calculation
    if data["weight_kg"] and data["height_cm"]:
        height_m = data["height_cm"] / 100
        bmi = data["weight_kg"] / (height_m ** 2)
        analysis["bmi"] = round(bmi, 1)
        
        if bmi < 18.5:
            analysis["bmi_status"] = "Underweight"
            analysis["recommendations"].append("Increase calorie intake with nutrient-dense foods.")
            analysis["recommendations"].append("Incorporate strength training to build muscle mass.")
        elif 18.5 <= bmi <= 24.9:
            analysis["bmi_status"] = "Normal"
            analysis["recommendations"].append("Maintain current balanced diet.")
            analysis["recommendations"].append("Continue regular aerobic and strength exercises.")
        elif 25 <= bmi <= 29.9:
            analysis["bmi_status"] = "Overweight"
            analysis["recommendations"].append("Focus on a portion-controlled, balanced diet.")
            analysis["recommendations"].append("Engage in at least 150 minutes of moderate aerobic activity per week.")
        else:
            analysis["bmi_status"] = "Obese"
            analysis["recommendations"].append("Consult a dietitian for a structured weight loss plan.")
            analysis["recommendations"].append("Start with low-impact exercises like walking or swimming.")
            
    # Blood Pressure Status
    if data["systolic"] and data["diastolic"]:
        sys, dia = data["systolic"], data["diastolic"]
        if sys < 120 and dia < 80:
            analysis["blood_pressure_status"] = "Normal"
        elif 120 <= sys <= 129 and dia < 80:
            analysis["blood_pressure_status"] = "Elevated"
            analysis["recommendations"].append("Monitor blood pressure regularly. Reduce sodium intake.")
        elif 130 <= sys <= 139 or 80 <= dia <= 89:
            analysis["blood_pressure_status"] = "High Blood Pressure (Stage 1)"
            analysis["recommendations"].append("Adopt the DASH diet (Dietary Approaches to Stop Hypertension).")
            analysis["recommendations"].append("Engage in regular cardiovascular exercise.")
        elif sys >= 140 or dia >= 90:
            analysis["blood_pressure_status"] = "High Blood Pressure (Stage 2) or higher"
            analysis["recommendations"].append("Urgent: Consult a doctor for blood pressure management.")
            analysis["recommendations"].append("Strictly limit salt and avoid alcohol/tobacco.")
            
    # Diabetes Risk
    if data["fasting_glucose"]:
        fg = data["fasting_glucose"]
        if fg < 100:
            analysis["diabetes_risk"] = "Low"
        elif 100 <= fg <= 125:
            analysis["diabetes_risk"] = "Prediabetes (Moderate Risk)"
            analysis["recommendations"].append("Cut down on refined sugars and simple carbohydrates.")
            analysis["recommendations"].append("Exercise regularly to improve insulin sensitivity.")
        else:
            analysis["diabetes_risk"] = "High (Indicative of Diabetes)"
            analysis["recommendations"].append("Urgent: Consult an endocrinologist or general physician.")
            analysis["recommendations"].append("Follow a strict diabetic meal plan with low glycemic index foods.")
            
    # Summary generation
    summary_parts = []
    if analysis["bmi_status"]:
        summary_parts.append(f"Your BMI indicates you are {analysis['bmi_status'].lower()}.")
    if analysis["blood_pressure_status"]:
        summary_parts.append(f"Your blood pressure is considered {analysis['blood_pressure_status'].lower()}.")
    if analysis["diabetes_risk"]:
        summary_parts.append(f"Your fasting glucose indicates a {analysis['diabetes_risk'].lower()} risk for diabetes.")
        
    analysis["summary"] = " ".join(summary_parts) if summary_parts else "Could not extract enough data for a complete summary."
    
    # Deduplicate recommendations
    analysis["recommendations"] = list(set(analysis["recommendations"]))
    if not analysis["recommendations"]:
        analysis["recommendations"] = ["Maintain a healthy lifestyle with balanced diet and regular exercise."]
        
    return analysis
