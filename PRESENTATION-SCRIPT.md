# MediGuide AI - Presentation Script & Demo Flow

This guide is designed to help you confidently present **MediGuide AI** to your professor ("Sir") or review panel. It provides a step-by-step script on what to say and what to do on-screen.

---

## 1. Introduction (The Pitch)
*What to say:*
> "Good morning/afternoon, Sir. Our project is **MediGuide AI**. 
> The core problem we are solving is that medical reports are often complex and hard for the average person to understand. MediGuide AI acts as an intelligent medical assistant. It automatically reads medical reports (PDFs/Images/Text), extracts key vitals, analyzes the data for health risks, and provides readable insights, lifestyle recommendations, and even finds nearby specialist doctors."

## 2. Technical Architecture Overview
*What to say:*
> "Before I show the demo, here is a quick overview of our tech stack:
> - **Frontend:** Modern, responsive UI built with React.js, TailwindCSS, and Framer Motion for smooth animations.
> - **Backend:** Node.js with Express and MongoDB for secure user authentication and data storage.
> - **AI Engine:** A Python FastAPI microservice that handles OCR (using PyTesseract) and Natural Language Processing to intelligently parse the reports and calculate health risks.
> - **Mapping API:** We integrated the OpenStreetMap Overpass API and React-Leaflet to locate nearby medical specialists."

---

## 3. The Live Demonstration (Step-by-Step)

### Step 1: Start the Application
*Action:* Double-click `start.bat` on your computer.
> "We have automated the deployment. By running our startup script, the Frontend, Backend, and AI microservices all spin up concurrently within seconds."

### Step 2: User Onboarding (Auth)
*Action:* Open the browser to `http://localhost:5173`. Create a new test account or log into an existing one.
> "Here is our landing page. As a new user, I can securely register an account. Our system uses encrypted authentication via our Node.js backend."

### Step 3: Uploading a Medical Report
*Action:* Go to the Upload section. Upload one of the test reports (e.g., `sample_report.txt` or one from the `ReportTests` directory).
> "Now, I will upload a raw medical report. Behind the scenes, our front end is sending this file to our Python AI Engine. The engine uses OCR and NLP to read through the unstructured text, identify key markers like Glucose or Blood Pressure, and format them into structured data."

### Step 4: The Dashboard & AI Analysis
*Action:* Once the dashboard loads, slowly scroll through the vital cards.
> "Here you can see the results. MediGuide AI has successfully parsed the document and generated this dashboard:
> - **Health Vitals:** It extracted metrics like BMI, Heart Rate, and Blood Pressure.
> - **Risk Assessment:** Notice the automated alerts. If a value is out of the normal range (like high glucose indicating diabetes risk), the system visually flags it in red.
> - **Lifestyle AI Recommendations:** Based on the extracted anomalies, the AI provides personalized dietary and medical recommendations to improve the patient's stats."

### Step 5: Doctor Recommendations (Location Feature)
*Action:* Scroll down to the Map section. Click the 'Use my current GPS location' button or search for your local city.
> "If a patient needs professional attention, they don't have to leave the app. Based on the analysis, we integrated OpenStreetMap to instantly find nearby clinics and hospitals. It plots them dynamically on an interactive map right inside the dashboard."

### Step 6: The AI Chatbot
*Action:* Open the Chatbot in the corner. Either type or use the voice mic to ask: *"What is my glucose level?"* or *"What should I eat?"*
> "Finally, we have an interactive AI Chatbot. It provides an accessibility layer. Users can simply ask questions about their health report using voice or text, and the AI responds conversationally."

---

## 4. Conclusion & Future Scope
*What to say:*
> "In conclusion, MediGuide AI bridges the gap between complex medical documents and patient understanding. 
> For future scope, we plan to integrate more advanced LLMs for predictive diagnostics and direct appointment booking with the mapped clinics."
> 
> "Thank you, Sir. We are now open to any questions."

---

### Pro-Tips for Presenting:
1. **Test Beforehand:** Always run `start.bat` and do a full trial run 30 minutes before the presentation. Ensure your MongoDB is running.
2. **Have Backup Files:** Keep your `sample_report.txt` and `ReportTests` folder easily accessible on your desktop so you don't fumble while browsing for a file to upload.
3. **Be Confident:** If an API (like the Map) takes a second to load, just keep talking through what the app is doing behind the scenes. Our app has a built-in fallback for the map, so it will always show data!
