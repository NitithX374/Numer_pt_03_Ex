import React, { useState } from "react";

const NewtonInterpolationCalculator = () => {
    const [numPoints, setNumPoints] = useState(3);
    const [points, setPoints] = useState(Array(3).fill({ x: 0, y: 0 }));
    const [selectedPoints, setSelectedPoints] = useState(Array(3).fill(true));
    const [targetX, setTargetX] = useState(0);
    const [result, setResult] = useState(null);
    const [steps, setSteps] = useState([]);

    const handleNumPointsChange = (event) => {
        const value = parseInt(event.target.value);
        setNumPoints(value);
        setPoints(Array(value).fill({ x: 0, y: 0 }));
        setSelectedPoints(Array(value).fill(true));
        setResult(null);
        setSteps([]);
    };

    const handlePointChange = (index, field, value) => {
        const newPoints = points.map((point, i) =>
            i === index ? { ...point, [field]: Number(value) } : point
        );
        setPoints(newPoints);
    };

    const handleCheckboxChange = (index) => {
        const newSelectedPoints = [...selectedPoints];
        newSelectedPoints[index] = !newSelectedPoints[index];
        setSelectedPoints(newSelectedPoints);
    };

    const calculateInterpolation = () => {
        // Filter the selected points
        const selectedData = points.filter((_, index) => selectedPoints[index]);

        if (selectedData.length < 2) {
            alert("Please select at least two points for interpolation.");
            return;
        }

        const n = selectedData.length;
        const xValues = selectedData.map(point => point.x);
        const yValues = selectedData.map(point => point.y);
        const dividedDiffTable = [...yValues];
        const stepLog = [];

        // Construct the divided difference table
        for (let i = 1; i < n; i++) {
            for (let j = n - 1; j >= i; j--) {
                dividedDiffTable[j] = (dividedDiffTable[j] - dividedDiffTable[j - 1]) / (xValues[j] - xValues[j - i]);
            }
        }

        stepLog.push("Divided Difference Table:");
        stepLog.push(dividedDiffTable.map((val, idx) => `f[${idx}] = ${val.toFixed(6)}`).join("\n"));

        // Use the divided differences to interpolate
        let interpolatedValue = dividedDiffTable[0];
        let productTerm = 1;

        for (let i = 1; i < n; i++) {
            productTerm *= (targetX - xValues[i - 1]);
            interpolatedValue += dividedDiffTable[i] * productTerm;

            // Log each step in the interpolation formula
            stepLog.push(`Step ${i}: f(x) += ${dividedDiffTable[i].toFixed(6)} * (${targetX} - ${xValues[i - 1]})`);
        }

        setResult(interpolatedValue);
        setSteps(stepLog);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-3xl font-bold text-center mb-6">Newton's Divided Difference Interpolation</h2>

                {/* Number of Points Input */}
                <div className="flex mb-4">
                    <label className="mr-2">Number of Points:</label>
                    <input
                        type="number"
                        value={numPoints}
                        onChange={handleNumPointsChange}
                        className="border border-gray-300 p-2 rounded w-20"
                    />
                </div>

                {/* Points Input */}
                <h3 className="text-xl font-bold mb-2">Input Points</h3>
                {points.map((point, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                        <input
                            type="checkbox"
                            checked={selectedPoints[index]}
                            onChange={() => handleCheckboxChange(index)}
                        />
                        <label className="mr-2">x{index + 1}:</label>
                        <input
                            type="number"
                            value={point.x}
                            onChange={(e) => handlePointChange(index, "x", e.target.value)}
                            className="border border-gray-300 p-2 rounded w-20"
                        />
                        <label className="mr-2">y{index + 1}:</label>
                        <input
                            type="number"
                            value={point.y}
                            onChange={(e) => handlePointChange(index, "y", e.target.value)}
                            className="border border-gray-300 p-2 rounded w-20"
                        />
                    </div>
                ))}

                {/* Target X Input */}
                <h3 className="text-xl font-bold mb-2 mt-4">Interpolation</h3>
                <div className="flex items-center mb-4">
                    <label className="mr-2">Enter x to find f(x):</label>
                    <input
                        type="number"
                        value={targetX}
                        onChange={(e) => setTargetX(Number(e.target.value))}
                        className="border border-gray-300 p-2 rounded w-20"
                    />
                </div>

                <div className="flex justify-center mb-6">
                    <button
                        onClick={calculateInterpolation}
                        className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        Calculate
                    </button>
                </div>

                {/* Result Display */}
                {result !== null && (
                    <div className="text-center mb-6">
                        <h3 className="text-xl font-bold">f({targetX}) ≈ {result.toFixed(6)}</h3>
                    </div>
                )}

                {/* Steps Display */}
                {steps.length > 0 && (
                    <div className="text-center mb-6">
                        <h3 className="text-xl font-bold">Steps</h3>
                        <pre className="text-left whitespace-pre-wrap border border-gray-300 p-4 rounded bg-gray-100">
                            {steps.join("\n\n")}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewtonInterpolationCalculator;
