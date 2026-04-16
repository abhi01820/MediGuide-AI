import fitz
import os

# Create the folder
output_dir = "../ReportTests"
os.makedirs(output_dir, exist_ok=True)

reports = [
    {
        "filename": "report1_healthy.pdf",
        "content": "MediGuide Clinical Laboratory - Comprehensive Health Report\n"
                   "==========================================================\n\n"
                   "Patient: Healthy Joe      Age: 28     Gender: Male\n"
                   "Date: " + "October 10, 2023" + "\n\n"
                   "--- VITALS & ANTHROPOMETRICS ---\n"
                   "Body Weight: 70 kg\n"
                   "Height: 175 cm\n"
                   "Blood Pressure: 115/75 mmHg\n\n"
                   "--- BIOCHEMISTRY & ENDOCRINOLOGY ---\n"
                   "Fasting Glucose: 90 mg/dL \n"
                   "Total Cholesterol: 160 mg/dL \n"
                   "Triglycerides: 110 mg/dL \n"
                   "Uric Acid: 5.2 mg/dL \n"
                   "Creatinine: 0.9 mg/dL \n"
                   "Electrolytes: 140 mEq/L \n\n"
                   "--- URINALYSIS ---\n"
                   "CUE: Normal \n\n"
                   "Notes: Patient is in perfect health. No disease indicated."
    },
    {
        "filename": "report2_hypertension_obese.pdf",
        "content": "MediGuide Clinical Laboratory - Comprehensive Health Report\n"
                   "==========================================================\n\n"
                   "Patient: Bob Smith        Age: 55     Gender: Male\n"
                   "Date: " + "October 11, 2023" + "\n\n"
                   "--- VITALS & ANTHROPOMETRICS ---\n"
                   "Body Weight: 105 kg\n"
                   "Height: 160 cm\n"
                   "Blood Pressure: 145/95 mmHg\n\n"
                   "--- BIOCHEMISTRY & ENDOCRINOLOGY ---\n"
                   "Fasting Glucose: 98 mg/dL\n"
                   "Total Cholesterol: 240 mg/dL\n"
                   "Triglycerides: 200 mg/dL\n"
                   "Uric Acid: 7.8 mg/dL\n"
                   "Creatinine: 1.4 mg/dL\n"
                   "Electrolytes: 148 mEq/L\n\n"
                   "--- URINALYSIS ---\n"
                   "CUE: Abnormal \n\n"
                   "Notes: Patient complains of frequent headaches and shortness of breath. Indicative of Cardiovascular Disease."
    },
    {
        "filename": "report3_diabetic.pdf",
        "content": "MediGuide Clinical Laboratory - Comprehensive Health Report\n"
                   "==========================================================\n\n"
                   "Patient: Mary Jane        Age: 42     Gender: Female\n"
                   "Date: " + "October 12, 2023" + "\n\n"
                   "--- VITALS & ANTHROPOMETRICS ---\n"
                   "Body Weight: 85 kg\n"
                   "Height: 170 cm\n"
                   "Blood Pressure: 128/82 mmHg\n\n"
                   "--- BIOCHEMISTRY & ENDOCRINOLOGY ---\n"
                   "Fasting Glucose: 155 mg/dL\n"
                   "Total Cholesterol: 210 mg/dL\n"
                   "Triglycerides: 180 mg/dL\n"
                   "Uric Acid: 6.5 mg/dL\n"
                   "Creatinine: 1.1 mg/dL\n"
                   "Electrolytes: 135 mEq/L\n\n"
                   "--- URINALYSIS ---\n"
                   "CUE: Abnormal \n\n"
                   "Notes: Family history of diabetes. Patient has Type 2 Diabetes."
    },
    {
        "filename": "report4_underweight.pdf",
        "content": "MediGuide Clinical Laboratory - Comprehensive Health Report\n"
                   "==========================================================\n\n"
                   "Patient: Lisa Ray         Age: 23     Gender: Female\n"
                   "Date: " + "October 13, 2023" + "\n\n"
                   "--- VITALS & ANTHROPOMETRICS ---\n"
                   "Body Weight: 45 kg\n"
                   "Height: 168 cm\n"
                   "Blood Pressure: 105/65 mmHg\n\n"
                   "--- BIOCHEMISTRY & ENDOCRINOLOGY ---\n"
                   "Fasting Glucose: 82 mg/dL\n"
                   "Total Cholesterol: 150 mg/dL\n"
                   "Triglycerides: 90 mg/dL\n"
                   "Uric Acid: 4.1 mg/dL\n"
                   "Creatinine: 0.7 mg/dL\n"
                   "Electrolytes: 138 mEq/L\n\n"
                   "--- URINALYSIS ---\n"
                   "CUE: Normal \n\n"
                   "Notes: Patient reports feeling weak and fatigued frequently. Indication of Anemia."
    }
]

for report in reports:
    doc = fitz.open()
    page = doc.new_page()
    
    # Simple text insertion
    text = report["content"]
    p = fitz.Point(50, 50)
    page.insert_text(p, text, fontsize=14, fontname="helv")
    
    filepath = os.path.join(output_dir, report["filename"])
    doc.save(filepath)
    doc.close()
    print(f"Created {filepath}")

print("All test reports generated successfully!")
