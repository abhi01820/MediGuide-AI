import urllib.request
from utils.ocr import extract_text
import re
from utils.nlp import analyze_with_gemini

# Mock file path
file_path = r"D:\Official Work\MediGuideAI\ReportTests\report-5_sufiMom.pdf"
with open(file_path, "rb") as f:
    text = extract_text(f.read(), "report-5_sufiMom.pdf")

print("TEXT:")
print(text[:200])

res = analyze_with_gemini(text)
print("RESULT:")
print(res)
