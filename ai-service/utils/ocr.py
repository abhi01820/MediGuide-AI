import pytesseract
from pdf2image import convert_from_bytes
import io
from PIL import Image

def process_image(image_bytes: bytes) -> str:
    """Extract text from an image"""
    image = Image.open(io.BytesIO(image_bytes))
    text = pytesseract.image_to_string(image)
    return text

def process_pdf(pdf_bytes: bytes) -> str:
    """Extract text from a PDF"""
    try:
        images = convert_from_bytes(pdf_bytes)
    except Exception as e:
        # Note: on Windows this might fail if poppler is not installed/in PATH
        print(f"Error converting pdf to image: {e}")
        return ""
    text = ""
    for img in images:
        text += pytesseract.image_to_string(img) + "\n"
    return text

def extract_text(file_bytes: bytes, filename: str) -> str:
    if filename.lower().endswith(".pdf"):
        return process_pdf(file_bytes)
    else:
        return process_image(file_bytes)
