import re

def extract_health_data(text: str) -> dict:
    """
    Extracts key health parameters from the text.
    Uses fault-tolerant Regex to handle fragmented PDF text.
    """
    data = {
        "height_cm": None,
        "weight_kg": None,
        "blood_pressure": None, 
        "systolic": None,
        "diastolic": None,
        "fasting_glucose": None,
        "cholesterol": None,
        "lipid": None,
        "cue": None,
        "uric_acid": None,
        "creatinine": None,
        "electrolytes": None,
        "notes": None,
    }
    
    # Flatten text to space out linebreaks from PDF extraction
    text_clean = re.sub(r'\s+', ' ', text.lower())
    
    # Weight
    weight_match = re.search(r'(?:weight|body weight|wt)[\s:=]*([\d\.]+)\s*(kg|kilos|lbs?)', text_clean)
    if weight_match:
        val = float(weight_match.group(1))
        unit = weight_match.group(2)
        if 'lb' in unit: val = val * 0.453592
        data["weight_kg"] = round(val, 2)
        
    # Height
    height_match = re.search(r'(?:height|ht)[\s:=]*([\d\.]+)\s*(cm|m|inch(?:es)?)', text_clean)
    if height_match:
        val = float(height_match.group(1))
        unit = height_match.group(2)
        if unit == 'm': val = val * 100
        elif 'inch' in unit: val = val * 2.54
        data["height_cm"] = round(val, 2)
        
    # Blood Pressure (very forgiving)
    bp_match = re.search(r'(?:bp|blood pressure|b\.p\.?)[\s:=]*(\d{2,3})[\s/\\-]+(\d{2,3})', text_clean)
    if bp_match:
        data["systolic"] = int(bp_match.group(1))
        data["diastolic"] = int(bp_match.group(2))
        data["blood_pressure"] = f"{data['systolic']}/{data['diastolic']}"
        
    # Fasting Glucose OR generic Glucose/HbA1c/Sugar
    glucose_match = re.search(r'(?:fasting glucose|glucose|sugar|blood sugar|fbs)[\s:=]*([\d\.]+)\s*(?:mg/dl|mmol/l)?', text_clean)
    if glucose_match:
        val = float(glucose_match.group(1))
        # Handle mmol/L to mg/dL conversion (if value is surprisingly low like 5.5)
        if val < 30: val = val * 18.0182
        data["fasting_glucose"] = round(val, 2)
        
    # Additional Specific Vitals
    chol_match = re.search(r'(?:cholesterol|chol)[\s:=]*([\d\.]+)\s*(?:mg/dl|mmol/l)?', text_clean)
    if chol_match: data["cholesterol"] = round(float(chol_match.group(1)), 2)
        
    lipid_match = re.search(r'(?:lipid|triglycerides)[\s:=]*([\d\.]+)\s*(?:mg/dl|mmol/l)?', text_clean)
    if lipid_match: data["lipid"] = round(float(lipid_match.group(1)), 2)
        
    cue_match = re.search(r'(?:cue|urine examination|urine)[\s:=]*([a-zA-Z]+)', text_clean)
    if cue_match: data["cue"] = cue_match.group(1).strip().capitalize()
        
    uric_match = re.search(r'(?:uric acid|uric)[\s:=]*([\d\.]+)\s*(?:mg/dl|mmol/l)?', text_clean)
    if uric_match: data["uric_acid"] = round(float(uric_match.group(1)), 2)
        
    creat_match = re.search(r'(?:creatinine|creat|creatic)[\s:=]*([\d\.]+)\s*(?:mg/dl|umol/l)?', text_clean)
    if creat_match: data["creatinine"] = round(float(creat_match.group(1)), 2)
        
    elec_match = re.search(r'(?:electrolytes|electrolides|sodium|potassium)[\s:=]*([\d\.]+)\s*(?:meq/l|mmol/l)?', text_clean)
    if elec_match: data["electrolytes"] = round(float(elec_match.group(1)), 2)
        
    notes_match = re.search(r'notes?[\s:=]+(.*)', text.lower())
    if notes_match: data["notes"] = notes_match.group(1).strip().capitalize()

    return data

def analyze_health(data: dict) -> dict:
    """Calculates risks based on extracted parameters and returns highly detailed advice."""
    analysis = {
        "bmi": None,
        "bmi_status": "Data Missing",
        "blood_pressure_status": "Data Missing",
        "diabetes_risk": "Data Missing",
        "cholesterol_status": "Data Missing",
        "lipid_status": "Data Missing",
        "cue_status": "Data Missing",
        "uric_acid_status": "Data Missing",
        "creatinine_status": "Data Missing",
        "electrolytes_status": "Data Missing",
        "predicted_disease": None,
        "recommended_specialist": None,
        "summary": "",
        "recommendations": []
    }
    
    if data.get("notes"):
        notes_text = data["notes"].lower()
        if "disease" in notes_text or "diabetes" in notes_text or "hypertension" in notes_text or "obese" in notes_text or "anemia" in notes_text or "copd" in notes_text:
            analysis["predicted_disease"] = data["notes"].title()
            if "copd" in notes_text: analysis["recommended_specialist"] = "Pulmonologist"
            elif "cardio" in notes_text: analysis["recommended_specialist"] = "Cardiologist"
            elif "anemia" in notes_text: analysis["recommended_specialist"] = "Hematologist"
            elif "diabetes" in notes_text: analysis["recommended_specialist"] = "Endocrinologist"
            else: analysis["recommended_specialist"] = "General Physician"
    
    # === BMI Analysis ===
    if data["weight_kg"] and data["height_cm"]:
        height_m = data["height_cm"] / 100
        bmi = data["weight_kg"] / (height_m ** 2)
        analysis["bmi"] = round(bmi, 1)
        
        if bmi < 18.5:
            analysis["bmi_status"] = "Underweight"
            analysis["recommendations"].extend([
                "🍎 Diet: Focus on calorie-dense, nutritious foods such as nuts, avocados, and healthy oils to build mass safely.",
                "🥤 Diet: Add protein shakes or smoothies between meals to increase caloric intake effortlessly.",
                "🏋️‍♂️ Exercise: Focus strictly on resistance and strength training to build muscle mass rather than burning calories through excessive cardio."
            ])
        elif 18.5 <= bmi <= 24.9:
            analysis["bmi_status"] = "Healthy Weight"
            analysis["recommendations"].extend([
                "🍎 Diet: Maintain your current balanced diet. Ensure you are getting at least 5 servings of vegetables and fruits daily.",
                "🏃‍♂️ Exercise: Continue with 150 minutes of moderate cardiovascular workout combined with 2 days of strength training each week.",
                "💤 Lifestyle: Ensure you are getting 7-9 hours of consistent, high-quality sleep to maintain muscle recovery and metabolic rate."
            ])
        elif 25 <= bmi <= 29.9:
            analysis["bmi_status"] = "Overweight"
            analysis["recommendations"].extend([
                "🍎 Diet: Adopt a portion-controlled meal plan. Replace simple carbohydrates (white bread, sugar) with high-fiber complex carbs (oats, quinoa) to stay full longer.",
                "🏃‍♂️ Exercise: Aim for 45 minutes of aerobic exercise (brisk walking, cycling, or swimming) 5 times a week to stimulate fat loss.",
                "💧 Lifestyle: Drink at least 3 liters of water daily, especially a glass before meals, to naturally control appetite and boost metabolism."
            ])
        else:
            analysis["bmi_status"] = "Obese"
            analysis["recommendations"].extend([
                "🩺 Medical: Please consult a licensed dietitian or nutritionist to create a sustainable, personalized weight-management plan.",
                "🍎 Diet: Strictly establish a caloric deficit. Focus heavily on lean proteins (chicken, fish, lentils) and drastically reduce processed foods, sodas, and hidden sugars.",
                "🚶‍♂️ Exercise: Begin with low-impact exercises like swimming, elliptical machines, or daily 30-minute walks to avoid excessive strain on your joints.",
                "💤 Lifestyle: Address any sleep apnea or prolonged stress, as high cortisol levels actively promote fat storage."
            ])
            
    # === Blood Pressure Analysis ===
    if data["systolic"] and data["diastolic"]:
        sys, dia = data["systolic"], data["diastolic"]
        if sys < 120 and dia < 80:
            analysis["blood_pressure_status"] = "Optimal"
        elif 120 <= sys <= 129 and dia < 80:
            analysis["blood_pressure_status"] = "Elevated"
            analysis["recommendations"].extend([
                "🍎 Diet (BP): Restrict daily sodium (salt) intake to less than 2,300mg. Avoid canned soups, heavy sauces, and highly processed meats.",
                "🏃‍♂️ Exercise (BP): Adding daily stretching or yoga can naturally lower cortisol and blood pressure."
            ])
        elif 130 <= sys <= 139 or 80 <= dia <= 89:
            analysis["blood_pressure_status"] = "Hypertension (Stage 1)"
            analysis["recommendations"].extend([
                "🍎 Diet (BP): Strictly adopt the DASH (Dietary Approaches to Stop Hypertension) diet, prioritizing potassium-rich foods like bananas, spinach, and sweet potatoes.",
                "🏃‍♂️ Exercise (BP): Commit to 30-40 minutes of continuous cardiovascular exercise (like jogging or cycling) daily to strengthen heart elasticity.",
                "🚭 Lifestyle (BP): Limit alcohol consumption and completely avoid tobacco smoking, which immediately constricts blood vessels."
            ])
        elif sys >= 140 or dia >= 90:
            analysis["blood_pressure_status"] = "Hypertension (Stage 2)"
            analysis["recommendations"].extend([
                "🩺 Medical (BP): Urgent: Schedule an appointment with a Cardiologist or primary care physician immediately for potential anti-hypertensive medication.",
                "🍎 Diet (BP): Severe sodium restriction required (under 1,500mg daily). Completely eliminate fast food and processed meals from your diet.",
                "🧘‍♂️ Lifestyle (BP): Manage stress actively using deep breathing exercises or meditation, as anxiety heavily spikes blood pressure."
            ])
            
    # === Diabetes Risk (Glucose) Analysis ===
    if data["fasting_glucose"]:
        fg = data["fasting_glucose"]
        if fg < 100:
            analysis["diabetes_risk"] = "Low Risk"
        elif 100 <= fg <= 125:
            analysis["diabetes_risk"] = "Prediabetes (Elevated Risk)"
            analysis["recommendations"].extend([
                "🍎 Diet (Sugar): Completely eliminate sugary drinks (sodas, juices) and reduce foods with a high Glycemic Index (white rice, pastries).",
                "🏃‍♂️ Exercise (Sugar): Physical activity allows your muscles to absorb glucose without needing insulin. Walking for 15 minutes immediately after large meals effectively cuts blood sugar spikes.",
                "🩺 Medical (Sugar): Schedule an HbA1c test in 3 months to monitor your long-term average blood sugar levels."
            ])
        else:
            analysis["diabetes_risk"] = "High Risk (Indicative of Diabetes)"
            analysis["recommendations"].extend([
                "🩺 Medical (Sugar): Urgent: Please consult a Diabetologist or Endocrinologist immediately for an official diagnosis and treatment plan.",
                "🍎 Diet (Sugar): Follow a strict diabetic dietary framework. Every meal should combine healthy fats, lean protein, and high-fiber vegetables to drastically slow glucose absorption.",
                "🩸 Medical (Sugar): Purchase a home glucometer to begin monitoring your morning fasting levels and your post-meal spikes."
            ])
            
    # === Cholesterol Analysis ===
    if data.get("cholesterol"):
        chol = data["cholesterol"]
        if chol < 200:
            analysis["cholesterol_status"] = "Desirable"
        elif 200 <= chol <= 239:
            analysis["cholesterol_status"] = "Borderline High"
            analysis["recommendations"].append("🍎 Diet (Heart): Incorporate more foods with healthy fats (like avocados, nuts, salmon) and reduce trans fats to manage cholesterol levels.")
        else:
            analysis["cholesterol_status"] = "High Risk"
            analysis["recommendations"].append("🩺 Medical (Cholesterol): Consult a doctor regarding high cholesterol. Regular cardiovascular workouts can help.")

    # === Lipid Analysis ===
    if data.get("lipid"):
        lipid = data["lipid"]
        if lipid < 150: analysis["lipid_status"] = "Normal"
        elif 150 <= lipid <= 199: analysis["lipid_status"] = "Borderline High"
        else:
            analysis["lipid_status"] = "High Risk"
            analysis["recommendations"].append("🍎 Diet (Lipids): Restrict alcohol and added sugars, as these strongly raise triglyceride (lipid) levels.")

    # === CUE Analysis ===
    if data.get("cue"):
        cue = data["cue"].lower()
        if "normal" in cue: analysis["cue_status"] = "Normal"
        else:
            analysis["cue_status"] = "Abnormal"
            analysis["recommendations"].append("🩺 Medical (Urine): Abnormal urine test (CUE). Please consult a urologist or general physician to rule out infections or kidney stress.")

    # === Uric Acid Analysis ===
    if data.get("uric_acid"):
        uric = data["uric_acid"]
        if uric < 7.0: analysis["uric_acid_status"] = "Normal"
        else:
            analysis["uric_acid_status"] = "Elevated (Hyperuricemia)"
            analysis["recommendations"].append("🍎 Diet (Uric Acid): Elevated uric acid detected. Avoid purine-rich foods like red meat and alcohol to prevent gout.")

    # === Creatinine Analysis ===
    if data.get("creatinine"):
        creat = data["creatinine"]
        if 0.7 <= creat <= 1.2: analysis["creatinine_status"] = "Normal"
        else:
            analysis["creatinine_status"] = "Abnormal"
            analysis["recommendations"].append("🩺 Medical (Kidneys): Irregular creatinine levels point to kidney strain. Stay heavily hydrated and consult a nephrologist.")

    # === Electrolytes Analysis ===
    if data.get("electrolytes"):
        elec = data["electrolytes"]
        if 135 <= elec <= 145: analysis["electrolytes_status"] = "Balanced"
        else:
            analysis["electrolytes_status"] = "Imbalanced"
            analysis["recommendations"].append("💧 Lifestyle (Electrolytes): Drink balanced electrolyte fluids or evaluate dietary sodium and potassium sources.")
            
    # === General Summary ===
    status_notes = []
    if analysis["bmi_status"] != "Data Missing":
        status_notes.append(f"a {analysis['bmi_status'].lower()} body weight")
    if analysis["blood_pressure_status"] != "Data Missing":
        status_notes.append(f"a {analysis['blood_pressure_status'].lower()} blood pressure profile")
    if analysis["diabetes_risk"] != "Data Missing":
        status_notes.append(f"a {analysis['diabetes_risk'].lower()} for diabetes")
        
    if status_notes:
        analysis["summary"] = "Based on your medical report, you currently exhibit " + ", ".join(status_notes) + ". Please review our highly detailed clinical advice below."
    else:
        analysis["summary"] = "We couldn't clearly parse your metrics. Please ensure your report explicitly lists numerical values for Weight, Height, BP, or Fasting Glucose."
        analysis["recommendations"].append("🔍 Diagnostic: Please upload a clearer report, or ensure the values aren't completely obscured.")
    
    # Deduplicate while preserving order
    seen = set()
    unique_recs = []
    for r in analysis["recommendations"]:
        if r not in seen:
            seen.add(r)
            unique_recs.append(r)
            
    analysis["recommendations"] = unique_recs
        
    return analysis

