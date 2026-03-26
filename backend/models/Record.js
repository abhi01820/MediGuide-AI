const mongoose = require("mongoose");

const RecordSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    extracted_text: { type: String },
    raw_data: { type: Object },
    analysis: {
        bmi: Number,
        bmi_status: String,
        blood_pressure_status: String,
        diabetes_risk: String,
        summary: String,
        recommendations: [String]
    }
}, { timestamps: true });

module.exports = mongoose.model("Record", RecordSchema);
