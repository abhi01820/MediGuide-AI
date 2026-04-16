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
        cholesterol_status: String,
        lipid_status: String,
        cue_status: String,
        uric_acid_status: String,
        creatinine_status: String,
        electrolytes_status: String,
        predicted_disease: String,
        recommended_specialist: String,
        summary: String,
        recommendations: [String],
        metrics: [Object]
    }
}, { timestamps: true });

module.exports = mongoose.model("Record", RecordSchema);
