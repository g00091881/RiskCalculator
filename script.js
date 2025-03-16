document.getElementById("risk-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const age = parseInt(document.getElementById("age").value);
    const weight = parseFloat(document.getElementById("weight").value);
    const height = parseFloat(document.getElementById("height").value);
    const bloodPressure = document.getElementById("bloodPressure").value;

    const familyHistory = [];
    if (document.getElementById("diabetes").checked) familyHistory.push("diabetes");
    if (document.getElementById("cancer").checked) familyHistory.push("cancer");
    if (document.getElementById("alzheimers").checked) familyHistory.push("Alzheimer’s");

    if (!age || !weight || !height) {
        document.getElementById("error").textContent = "Please fill in all required fields.";
        return;
    }

    document.getElementById("error").textContent = "";

    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    let score = 0;

    // Age Score
    if (age < 30) score += 0;
    else if (age < 45) score += 10;
    else if (age < 60) score += 20;
    else score += 30;

    // BMI Score
    if (bmi < 25) score += 0;
    else if (bmi < 30) score += 30;
    else score += 75;

    // Blood Pressure Score
    const bpScores = {
        "normal": 0,
        "elevated": 15,
        "stage 1": 30,
        "stage 2": 75,
        "crisis": 100
    };
    score += bpScores[bloodPressure] || 0;

    // Family History Score
    score += familyHistory.length * 10;

    // Risk Category
    let riskCategory = "Uninsurable";
    if (score <= 20) riskCategory = "Low Risk";
    else if (score <= 50) riskCategory = "Moderate Risk";
    else if (score <= 75) riskCategory = "High Risk";

    document.getElementById("result").innerHTML = `
        <p><strong>Score:</strong> ${score}</p>
        <p><strong>Risk Category:</strong> ${riskCategory}</p>
    `;
});

