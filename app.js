import React, { useState } from "react";

export default function App() {
    const [formData, setFormData] = useState({
        age: "",
        weight: "",
        height: "",
        bloodPressure: "normal",
        familyHistory: [],
    });

    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            familyHistory: checked
                ? [...prev.familyHistory, value]
                : prev.familyHistory.filter((disease) => disease !== value),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const response = await fetch("http://localhost:5000/calculate-risk", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok) {
                setResult(data);
            } else {
                setError(data.error);
            }
        } catch (error) {
            setError("Error connecting to the server");
        }
    };

    return (
        <div className="container">
            <h2>Health Insurance Risk Calculator</h2>
            <form onSubmit={handleSubmit}>
                <label>Age:</label>
                <input type="number" name="age" value={formData.age} onChange={handleChange} required />

                <label>Weight (kg):</label>
                <input type="number" name="weight" value={formData.weight} onChange={handleChange} required />

                <label>Height (cm):</label>
                <input type="number" name="height" value={formData.height} onChange={handleChange} required min="60" />

                <label>Blood Pressure:</label>
                <select name="bloodPressure" value={formData.bloodPressure} onChange={handleChange}>
                    <option value="normal">Normal</option>
                    <option value="elevated">Elevated</option>
                    <option value="stage 1">Stage 1</option>
                    <option value="stage 2">Stage 2</option>
                    <option value="crisis">Crisis</option>
                </select>

                <label>Family History:</label>
                <div>
                    <input type="checkbox" value="diabetes" onChange={handleCheckboxChange} /> Diabetes
                    <input type="checkbox" value="cancer" onChange={handleCheckboxChange} /> Cancer
                    <input type="checkbox" value="Alzheimer’s" onChange={handleCheckboxChange} /> Alzheimer’s
                </div>

                <button type="submit">Calculate Risk</button>
            </form>

            {error && <p className="error">{error}</p>}

            {result && (
                <div className="result">
                    <h3>Risk Assessment</h3>
                    <p><strong>Score:</strong> {result.score}</p>
                    <p><strong>Risk Category:</strong> {result.riskCategory}</p>
                </div>
            )}
        </div>
    );
}
