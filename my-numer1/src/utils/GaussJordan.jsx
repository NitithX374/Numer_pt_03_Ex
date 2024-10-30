import React, { useState } from "react";

const GaussJordanCalculator = () => {
    const [sizeInput, setSizeInput] = useState("3");
    const [size, setSize] = useState(3);
    const [matrix, setMatrix] = useState(Array(3).fill().map(() => Array(3).fill(0)));
    const [constants, setConstants] = useState(Array(3).fill(0));
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

    const handleSizeInputChange = (event) => {
        const value = event.target.value;
        setSizeInput(value);

        const newSize = parseInt(value);
        if (!isNaN(newSize) && newSize > 0) {
            setSize(newSize);
            setMatrix(Array(newSize).fill().map(() => Array(newSize).fill(0)));
            setConstants(Array(newSize).fill(0));
            setResults([]);
            setSteps([]);
        }
    };

    const calculateGaussJordan = () => {
        try {
            const augmentedMatrix = matrix.map((row, i) => [...row, constants[i]]);
            const n = augmentedMatrix.length;
            const stepLog = [];

            // Gauss-Jordan elimination to convert the matrix to RREF
            for (let i = 0; i < n; i++) {
                // Make the diagonal element 1 (pivot row normalization)
                let pivot = augmentedMatrix[i][i];
                if (pivot === 0) {
                    throw new Error("The matrix is singular or near-singular.");
                }

                for (let j = 0; j <= n; j++) {
                    augmentedMatrix[i][j] /= pivot;
                }
                stepLog.push(`Row ${i + 1}: Divide by pivot ${pivot.toFixed(6)}`);

                // Make all elements in the current column 0 except the pivot
                for (let k = 0; k < n; k++) {
                    if (k !== i) {
                        const factor = augmentedMatrix[k][i];
                        for (let j = 0; j <= n; j++) {
                            augmentedMatrix[k][j] -= factor * augmentedMatrix[i][j];
                        }
                        stepLog.push(`Row ${k + 1}: Subtract ${factor.toFixed(6)} * Row ${i + 1}`);
                    }
                }

                // Log current matrix state
                stepLog.push(`Matrix after processing row ${i + 1}:\n${printMatrix(augmentedMatrix)}`);
            }

            // Extract solutions from the final augmented matrix in RREF
            const solutions = augmentedMatrix.map(row => row[n]);
            setResults(solutions);
            setSteps(stepLog);
        } catch (error) {
            alert(error.message || "Error in calculation. Please check your input values.");
            console.error("Calculation error:", error);
        }
    };

    const printMatrix = (matrix) => {
        return matrix.map(row => row.map(value => value.toFixed(3)).join(" | ")).join("\n");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-3xl font-bold text-center mb-6">Gauss-Jordan Elimination Calculator</h2>

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

                <div className="flex justify-center mb-6">
                    <button
                        onClick={calculateGaussJordan}
                        className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        Calculate
                    </button>
                </div>

                {/* Results Display */}
                {results.length > 0 && (
                    <div className="text-center mb-6">
                        <h3 className="text-xl font-bold">Solutions</h3>
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

export default GaussJordanCalculator;
