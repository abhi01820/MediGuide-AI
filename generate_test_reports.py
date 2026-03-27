import fitz
import os

# Create the folder
output_dir = "../ReportTests"
os.makedirs(output_dir, exist_ok=True)

reports = [
    {
        "filename": "report1_healthy.pdf",
        "content": "Patient: Healthy Joe\nAge: 28\n\nWeight: 70 kg\nHeight: 175 cm\nBlood Pressure: 115/75 mmHg\nFasting Glucose: 90 mg/dL\n\nNotes: Patient is in perfect health."
    },
    {
        "filename": "report2_hypertension_obese.pdf",
        "content": "Patient: Bob Smith\nAge: 55\n\nWT: 105 kg\nHT: 160 cm\nBP: 145/95\nSugar: 98 mg/dL\n\nNotes: Patient complains of frequent headaches and shortness of breath."
    },
    {
        "filename": "report3_diabetic.pdf",
        "content": "Patient: Mary Jane\nAge: 42\n\nBody Weight: 85 kg\nHeight: 170 cm\nBlood Pressure: 128/82 mmHg\nFasting Glucose: 155 mg/dL\n\nNotes: Family history of diabetes."
    },
    {
        "filename": "report4_underweight.pdf",
        "content": "Patient: Lisa Ray\nAge: 23\n\nWeight: 45 kg\nHeight: 168 cm\nB.P.: 105/65\nFBS: 82 mg/dL\n\nNotes: Patient reports feeling weak and fatigued frequently."
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
