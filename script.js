document.getElementById("risk-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    const age = document.getElementById("age").value;
    const weight = document.getElementById("weight").value;
    const height = document.getElementById("height").value;
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

    const response = await fetch("http://localhost:5000/calculate-risk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ age, weight, height, bloodPressure, familyHistory }),
    });

    const data = await response.json();

    if (response.ok) {
        document.getElementById("result").innerHTML = `
            <p><strong>Score:</strong> ${data.score}</p>
            <p><strong>Risk Category:</strong> ${data.riskCategory}</p>
        `;
    } else {
        document.getElementById("error").textContent = data.error;
    }
});
