const express = require("express");
const multer = require("multer");
const Record = require("../models/Record");
const { protect } = require("../middleware/authMiddleware");

// Note: Node 18+ has native fetch and FormData.
// For earlier node versions, we might need 'node-fetch' and 'form-data', but we will try native first.
const FormData = global.FormData || require("form-data");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const FASTAPI_URL = process.env.FASTAPI_URL || "http://localhost:8000";

// Upload Report
router.post("/upload", protect, upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Prepare form data for FastAPI
        const formData = new FormData();
        const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
        formData.append("file", blob, req.file.originalname);

        // Standard fetch API exists in Node 18+
        const response = await fetch(`${FASTAPI_URL}/analyze-report`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const errorDetails = await response.text();
            console.error("FastAPI error:", errorDetails);
            return res.status(response.status).json({ message: "Error analyzing report via AI Service." });
        }

        const aiResult = await response.json();

        // Save to Database
        const record = new Record({
            user: req.user._id,
            extracted_text: aiResult.extracted_text,
            raw_data: aiResult.raw_data,
            analysis: aiResult.analysis
        });

        const createdRecord = await record.save();
        res.status(201).json(createdRecord);

    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ message: error.message });
    }
});

// Get User History
router.get("/history", protect, async (req, res) => {
    try {
        const records = await Record.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
