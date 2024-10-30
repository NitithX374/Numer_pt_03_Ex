import React, { useState } from "react";

const SplineInterpolationCalculator = () => {
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

    const calculateSpline = () => {
        const selectedData = points.filter((_, index) => selectedPoints[index]);

        if (selectedData.length < 2) {
            alert("Please select at least two points for interpolation.");
            return;
        }

        const n = selectedData.length;
        const xValues = selectedData.map(point => point.x);
        const yValues = selectedData.map(point => point.y);
        const h = [];
        const a = yValues.slice(); // a[i] = f(x[i])
        const b = new Array(n).fill(0); // b[i] = slope
        const c = new Array(n).fill(0); // c[i] = second derivative
        const d = new Array(n - 1).fill(0); // d[i] = change in slope

        // Calculate the intervals
        for (let i = 0; i < n - 1; i++) {
            h[i] = xValues[i + 1] - xValues[i];
        }

        // Set up the system of equations
        const A = Array(n).fill(null).map(() => Array(n).fill(0));
        const rhs = Array(n).fill(0);

        // Interior points
        for (let i = 1; i < n - 1; i++) {
            A[i][i - 1] = h[i - 1];
            A[i][i] = 2 * (h[i - 1] + h[i]);
            A[i][i + 1] = h[i];
            rhs[i] = (3 / h[i]) * (a[i + 1] - a[i]) - (3 / h[i - 1]) * (a[i] - a[i - 1]);
        }

        // Natural spline conditions
        A[0][0] = 1; // c[0] = 0
        A[n - 1][n - 1] = 1; // c[n-1] = 0

        // Solve the system of equations for c
        const cSol = gaussianElimination(A, rhs);
        c.forEach((_, index) => c[index] = cSol[index]);

        // Calculate b and d
        for (let i = 0; i < n - 1; i++) {
            b[i] = (a[i + 1] - a[i]) / h[i] - (h[i] * (c[i + 1] + 2 * c[i])) / 3;
            d[i] = (c[i + 1] - c[i]) / (3 * h[i]);
        }

        // Evaluate the spline for targetX
        let interpolatedValue = 0;
        let foundInterval = false;

        for (let i = 0; i < n - 1; i++) {
            if (targetX >= xValues[i] && targetX <= xValues[i + 1]) {
                interpolatedValue = a[i] + b[i] * (targetX - xValues[i]) + 
                                    c[i] * Math.pow(targetX - xValues[i], 2) + 
                                    d[i] * Math.pow(targetX - xValues[i], 3);
                foundInterval = true;
                break;
            }
        }

        if (!foundInterval) {
            alert("The target x value is outside the interpolation range.");
            return;
        }

        setResult(interpolatedValue);
        setSteps([`Spline Interpolation Result: f(${targetX}) ≈ ${interpolatedValue.toFixed(6)}`]);
    };

    const gaussianElimination = (A, b) => {
        const n = A.length;
        for (let i = 0; i < n; i++) {
            // Pivot
            let maxRow = i;
            for (let k = i + 1; k < n; k++) {
                if (Math.abs(A[k][i]) > Math.abs(A[maxRow][i])) {
                    maxRow = k;
                }
            }
            [A[i], A[maxRow]] = [A[maxRow], A[i]];
            [b[i], b[maxRow]] = [b[maxRow], b[i]];

            // Eliminate
            for (let k = i + 1; k < n; k++) {
                const factor = A[k][i] / A[i][i];
                for (let j = i; j < n; j++) {
                    A[k][j] -= factor * A[i][j];
                }
                b[k] -= factor * b[i];
            }
        }

        // Back substitution
        const x = Array(n).fill(0);
        for (let i = n - 1; i >= 0; i--) {
            x[i] = b[i] / A[i][i];
            for (let k = i - 1; k >= 0; k--) {
                b[k] -= A[k][i] * x[i];
            }
        }
        return x;
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-3xl font-bold text-center mb-6">Spline Interpolation</h2>

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
                        onClick={calculateSpline}
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

export default SplineInterpolationCalculator;
