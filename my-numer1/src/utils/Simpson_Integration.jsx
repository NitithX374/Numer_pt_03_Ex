import React, { useState } from "react";
import { Parser } from "expr-eval";
import Plot from "react-plotly.js";

const SimpsonRuleCalculator = () => {
    const [lowerBound, setLowerBound] = useState(0);
    const [upperBound, setUpperBound] = useState(1);
    const [numSegments, setNumSegments] = useState(10);
    const [equation, setEquation] = useState("");
    const [result, setResult] = useState(null);
    const [steps, setSteps] = useState([]);
    const [error, setError] = useState(null);
    const [plotData, setPlotData] = useState([]);

    const handleCalculate = () => {
        const a = lowerBound;
        const b = upperBound;
        const n = numSegments;

        if (n % 2 === 1) {
            alert("Number of segments (n) must be even for Simpson's Rule.");
            return;
        }

        const h = (b - a) / n; // Width of each segment
        let sum = 0;

        // Parse the equation using expr-eval
        const f = (x) => Parser.parse(equation).evaluate({ x });

        // Simpson's rule calculation
        sum += f(a) + f(b); // f(a) + f(b)
        for (let i = 1; i < n; i++) {
            if (i % 2 === 0) {
                sum += 2 * f(a + i * h); // 2 * f(x_i) for even i
            } else {
                sum += 4 * f(a + i * h); // 4 * f(x_i) for odd i
            }
        }
        const simpsonResult = (h / 3) * sum;

        // Set results
        setResult(simpsonResult);
        setError(null); // Reset error since we're not calculating an exact value

        // Create steps for explanation
        const stepLog = [];
        stepLog.push(`Simpson's Rule Formula: S_n = (h / 3) * (f(a) + 4 * Σ f(x_{odd}) + 2 * Σ f(x_{even}))`);
        stepLog.push(`Where h = (b - a) / n = (${b} - ${a}) / ${n} = ${h}`);
        stepLog.push(`Sum Calculation: f(${a}) + f(${b}) + 4 * (f(${a + h}) + f(${a + 3 * h}) + ...) + 2 * (f(${a + 2 * h}) + f(${a + 4 * h}) + ...)`);
        stepLog.push(`Result: S_n = (h / 3) * ${sum} = ${simpsonResult.toFixed(6)}`);

        setSteps(stepLog);

        // Prepare data for plot
        const xValues = [];
        const yValues = [];
        for (let i = a; i <= b; i += h / 100) {
            xValues.push(i);
            yValues.push(f(i));
        }

        const simpsonDataX = [];
        const simpsonDataY = [];
        for (let i = 0; i < n; i++) {
            simpsonDataX.push(a + i * h, a + (i + 1) * h, null); // x values for segments
            simpsonDataY.push(f(a + i * h), f(a + (i + 1) * h), null); // y values for segments
        }

        const newPlotData = [
            {
                x: xValues,
                y: yValues,
                mode: "lines",
                name: `f(x) = ${equation}`,
                line: { color: "rgba(75, 192, 192, 1)" },
            },
            {
                x: simpsonDataX,
                y: simpsonDataY,
                mode: "lines+markers",
                name: "Simpson's Approximation",
                line: { color: "rgba(255, 99, 132, 1)" },
                fill: "tozeroy",
                fillcolor: "rgba(255, 99, 132, 0.5)",
            },
        ];

        setPlotData(newPlotData);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-3xl font-bold text-center mb-6">Simpson's Rule Calculator</h2>

                {/* Input Fields */}
                <div className="flex mb-4">
                    <label className="mr-2">Lower Bound (a):</label>
                    <input
                        type="number"
                        value={lowerBound}
                        onChange={(e) => setLowerBound(Number(e.target.value))}
                        className="border border-gray-300 p-2 rounded w-20"
                    />
                </div>

                <div className="flex mb-4">
                    <label className="mr-2">Upper Bound (b):</label>
                    <input
                        type="number"
                        value={upperBound}
                        onChange={(e) => setUpperBound(Number(e.target.value))}
                        className="border border-gray-300 p-2 rounded w-20"
                    />
                </div>

                <div className="flex mb-4">
                    <label className="mr-2">Number of Segments (n):</label>
                    <input
                        type="number"
                        value={numSegments}
                        onChange={(e) => setNumSegments(Number(e.target.value))}
                        className="border border-gray-300 p-2 rounded w-20"
                    />
                </div>

                <div className="flex mb-4">
                    <label className="mr-2">Equation:</label>
                    <input
                        type="text"
                        value={equation}
                        onChange={(e) => setEquation(e.target.value)}
                        className="border border-gray-300 p-2 rounded flex-grow"
                    />
                </div>

                <div className="flex justify-center mb-6">
                    <button
                        onClick={handleCalculate}
                        className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        Calculate
                    </button>
                </div>

                {/* Display the Equation */}
                {equation && (
                    <div className="text-center mb-6">
                        <h3 className="text-xl font-bold">Equation: f(x) = {equation}</h3>
                    </div>
                )}

                {/* Result Display */}
                {result !== null && (
                    <div className="text-center mb-6">
                        <h3 className="text-xl font-bold">Result: S_n ≈ {result.toFixed(6)}</h3>
                        <h3 className="text-xl font-bold">Error Estimate: {error?.toFixed(6)}</h3>
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

                {/* Plot Display */}
                {plotData.length > 0 && (
                    <div className="mt-6">
                        <h3 className="text-xl font-bold">Graph of the Function and Simpson's Approximation</h3>
                        <Plot
                            data={plotData}
                            layout={{
                                title: "Function and Simpson's Approximation",
                                xaxis: {
                                    title: "x",
                                },
                                yaxis: {
                                    title: "f(x)",
                                },
                                showlegend: true,
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default SimpsonRuleCalculator;
