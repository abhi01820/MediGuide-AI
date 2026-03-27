import fitz  # PyMuPDF
import pytesseract
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
        pdf_document = fitz.open(stream=pdf_bytes, filetype="pdf")
        text = ""
        for page_num in range(pdf_document.page_count):
            page = pdf_document.load_page(page_num)
            text += page.get_text() + "\n"
            
        # If text is extremely sparse, it might be a scanned PDF. Fallback to extracting the page as an image and running OCR.
        if len(text.strip()) < 20:
            text = "" # Reset
            for page_num in range(pdf_document.page_count):
                page = pdf_document.load_page(page_num)
                pix = page.get_pixmap() # Renders page to image without Poppler
                img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
                text += pytesseract.image_to_string(img) + "\n"
                
        return text
    except Exception as e:
        print(f"Error extracting pdf: {e}")
        return ""

def extract_text(file_bytes: bytes, filename: str) -> str:
    if filename.lower().endswith(".pdf"):
        return process_pdf(file_bytes)
    else:
        return process_image(file_bytes)
