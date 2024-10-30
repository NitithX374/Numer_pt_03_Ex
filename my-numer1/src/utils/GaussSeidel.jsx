import React, { useState } from "react";

const GaussSeidelCalculator = () => {
    const [sizeInput, setSizeInput] = useState("3");
    const [size, setSize] = useState(3);
    const [matrix, setMatrix] = useState(Array(3).fill().map(() => Array(3).fill(0)));
    const [constants, setConstants] = useState(Array(3).fill(0));
    const [initialGuess, setInitialGuess] = useState(Array(3).fill(0));
    const [tolerance, setTolerance] = useState(0.0001);
    const [maxIterations, setMaxIterations] = useState(100);
    const [results, setResults] = useState([]);
    const [steps, setSteps] = useState([]);

    const handleMatrixChange = (row, col, value) => {
        const newMatrix = matrix.map((r, rIndex) =>
            r.map((c, cIndex) => (rIndex === row && cIndex === col ? Number(value) : c))
        );
        setMatrix(newMatrix);
    };

    const handleConstantChange = (index, value) => {
        const newConstants = [...constants];
        newConstants[index] = Number(value);
        setConstants(newConstants);
    };

    const handleInitialGuessChange = (index, value) => {
        const newInitialGuess = [...initialGuess];
        newInitialGuess[index] = Number(value);
        setInitialGuess(newInitialGuess);
    };

    const handleSizeInputChange = (event) => {
        const value = event.target.value;
        setSizeInput(value);

        const newSize = parseInt(value);
        if (!isNaN(newSize) && newSize > 0) {
            setSize(newSize);
            setMatrix(Array(newSize).fill().map(() => Array(newSize).fill(0)));
            setConstants(Array(newSize).fill(0));
            setInitialGuess(Array(newSize).fill(0));
            setResults([]);
            setSteps([]);
        }
    };

    const calculateGaussSeidel = () => {
        try {
            const n = matrix.length;
            let currentGuess = [...initialGuess];
            const stepLog = [];
            let hasConverged = false;

            for (let iteration = 0; iteration < maxIterations; iteration++) {
                const oldGuess = [...currentGuess];
                stepLog.push(`Iteration ${iteration + 1}:`);

                for (let i = 0; i < n; i++) {
                    let sum = constants[i];
                    for (let j = 0; j < n; j++) {
                        if (i !== j) {
                            sum -= matrix[i][j] * currentGuess[j];
                        }
                    }
                    currentGuess[i] = sum / matrix[i][i];

                    // Log each variable update within this iteration
                    stepLog.push(`x${i + 1} = ${currentGuess[i].toFixed(6)}`);
                }

                // Check convergence
                hasConverged = currentGuess.every((val, idx) =>
                    Math.abs(val - oldGuess[idx]) < tolerance
                );

                if (hasConverged) {
                    stepLog.push(`Converged after ${iteration + 1} iterations.`);
                    break;
                }
            }

            if (!hasConverged) {
                stepLog.push("Reached maximum iterations without full convergence.");
            }

            setResults(currentGuess);
            setSteps(stepLog);
        } catch (error) {
            alert(error.message || "Error in calculation. Please check your input values.");
            console.error("Calculation error:", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-3xl font-bold text-center mb-6">Gauss-Seidel Calculator</h2>

                {/* Size Input */}
                <div className="flex mb-4">
                    <label className="mr-2">Matrix Size:</label>
                    <input
                        type="number"
                        value={sizeInput}
                        onChange={handleSizeInputChange}
                        className="border border-gray-300 p-2 rounded w-20"
                    />
                </div>

                {/* Matrix Input */}
                <h3 className="text-xl font-bold mb-2">Input Matrix</h3>
                {matrix.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex space-x-2 mb-2">
                        {row.map((value, colIndex) => (
                            <input
                                key={colIndex}
                                type="number"
                                value={value}
                                onChange={(e) => handleMatrixChange(rowIndex, colIndex, e.target.value)}
                                className="border border-gray-300 p-2 rounded"
                            />
                        ))}
                    </div>
                ))}

                {/* Constants Input */}
                <h3 className="text-xl font-bold mb-2 mt-4">Input Constants</h3>
                {constants.map((value, index) => (
                    <input
                        key={index}
                        type="number"
                        value={value}
                        onChange={(e) => handleConstantChange(index, e.target.value)}
                        className="border border-gray-300 p-2 rounded mb-2"
                    />
                ))}

                {/* Initial Guess Input */}
                <h3 className="text-xl font-bold mb-2 mt-4">Initial Guess</h3>
                {initialGuess.map((value, index) => (
                    <input
                        key={index}
                        type="number"
                        value={value}
                        onChange={(e) => handleInitialGuessChange(index, e.target.value)}
                        className="border border-gray-300 p-2 rounded mb-2"
                    />
                ))}

                {/* Tolerance and Max Iterations */}
                <div className="flex mt-4 space-x-4">
                    <div>
                        <label className="mr-2">Tolerance:</label>
                        <input
                            type="number"
                            value={tolerance}
                            onChange={(e) => setTolerance(Number(e.target.value))}
                            className="border border-gray-300 p-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="mr-2">Max Iterations:</label>
                        <input
                            type="number"
                            value={maxIterations}
                            onChange={(e) => setMaxIterations(Number(e.target.value))}
                            className="border border-gray-300 p-2 rounded"
                        />
                    </div>
                </div>

                <div className="flex justify-center mb-6 mt-4">
                    <button
                        onClick={calculateGaussSeidel}
                        className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        Calculate
                    </button>
                </div>

                {/* Results Display */}
                {results.length > 0 && (
                    <div className="text-center mb-6">
                        <h3 className="text-xl font-bold">Solution</h3>
                        <ul>
                            {results.map((solution, index) => (
                                <li key={index}>
                                    x{index + 1} = {solution.toFixed(6)}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Steps Display */}
                {steps.length > 0 && (
                    <div className="text-center mb-6">
                        <h3 className="text-xl font-bold">Iterations</h3>
                        <pre className="text-left whitespace-pre-wrap border border-gray-300 p-4 rounded bg-gray-100">
                            {steps.join("\n\n")}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GaussSeidelCalculator;
