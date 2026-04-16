# MediGuide AI - Intelligent Healthcare Web Application

> 🎓 **Presenting this project?** Check out the step-by-step [Presentation Script (PRESENTATION-SCRIPT.md)](./PRESENTATION-SCRIPT.md) for what to say and do during your defense!
## Features
- **Frontend**: React + Vite + TailwindCSS for a beautiful, modern UI.
- **Backend**: Node.js + Express for Authentication and orchestration.
- **AI Service**: FastAPI + Pytesseract + spaCy for OCR, data extraction, and health analysis (BMI, Diabetes Risk, Blood Pressure).
- **Chatbot**: Multilingual voice chatbot supporting speech-to-text and text-to-speech.
- **Doctor Recs**: Google Maps integration for finding nearby specialists.

## Prerequisites (Windows)
1. **Node.js** v18+ 
2. **Python** 3.10+
3. **MongoDB** (running on `localhost:27017` or change `MONGO_URI` in `backend/.env`)
4. **Tesseract OCR**: 
   - Download the Windows installer from [UB-Mannheim/tesseract](https://github.com/UB-Mannheim/tesseract/wiki).
   - Install it and ensure `C:\Program Files\Tesseract-OCR` is added to your system `PATH` environment variable.
5. **Poppler** (Required for PDF extraction):
   - Download the latest Poppler Windows binaries.
   - Extract and add the `bin` folder to your system `PATH`.

## How to Run

An automated start script has been provided for Windows. Simply double-click on `start.bat` in the root folder, or run:
```cmd
.\start.bat
```

This will concurrently start:
1. React Frontend on `http://localhost:5173`
2. Node Backend on `http://localhost:5000`
3. FastAPI Service on `http://localhost:8000`

### Testing the App
1. Open the frontend in your browser.
2. Sign up to create an account.
3. Upload the provided `sample_report.txt` file (or a real PDF if Tesseract/Poppler are installed).
4. Review your AI-analyzed Dashboard.
5. Try the Chatbot widget by clicking the mic icon and asking "What is my diabetes risk?"
