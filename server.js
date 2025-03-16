const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const calculateRiskScore = ({ age, bmi, bloodPressure, familyHistory }) => {
    let score = 0;

    // Age Penalty
    if (age < 30) score += 0;
    else if (age < 45) score += 10;
    else if (age < 60) score += 20;
    else score += 30;

    // BMI Penalty
    if (bmi < 25) score += 0;
    else if (bmi < 30) score += 30;
    else score += 75;

    // Blood Pressure Penalty
    const bpPenalties = {
        "normal": 0,
        "elevated": 15,
        "stage 1": 30,
        "stage 2": 75,
        "crisis": 100
    };
    score += bpPenalties[bloodPressure] || 0;

    // Family History Penalty
    familyHistory.forEach(disease => {
        if (["diabetes", "cancer", "Alzheimer’s"].includes(disease)) {
            score += 10;
        }
    });

    // Risk Category
    let riskCategory = "Uninsurable";
    if (score <= 20) riskCategory = "Low Risk";
    else if (score <= 50) riskCategory = "Moderate Risk";
    else if (score <= 75) riskCategory = "High Risk";

    return { score, riskCategory };
};

app.post('/calculate-risk', (req, res) => {
    const { age, weight, height, bloodPressure, familyHistory } = req.body;

    if (!age || !weight || !height || !bloodPressure) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);

    const result = calculateRiskScore({ age, bmi, bloodPressure, familyHistory });
    res.json(result);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
