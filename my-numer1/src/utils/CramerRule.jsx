import React, { useState } from "react";
import { det } from "mathjs";

const CramerCalculator = () => {
    const [sizeInput, setSizeInput] = useState("3");
    const [size, setSize] = useState(3);
    const [matrix, setMatrix] = useState(Array(3).fill().map(() => Array(3).fill(0)));
    const [constants, setConstants] = useState(Array(3).fill(0));
    const [results, setResults] = useState([]);
    const [mainDet, setMainDet] = useState(null);

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
            setMainDet(null);
        }
    };

    const calculateCramer = () => {
        try {
            // Validate input values
            for(let i = 0; i < size; i++) {
                for(let j = 0; j < size; j++) {
                    if(isNaN(matrix[i][j])) {
                        throw new Error("Matrix contains invalid values");
                    }
                }
                if(isNaN(constants[i])) {
                    throw new Error("Constants vector contains invalid values");
                }
            }

            // Calculate main determinant
            const detA = det(matrix);
            setMainDet(detA);

            if (Math.abs(detA) < 1e-10) {
                throw new Error("The system has no unique solution (determinant is too close to 0)");
            }

            const solutions = [];
            // Calculate solution for each variable
            for (let i = 0; i < size; i++) {
                // Create matrix for current variable by replacing i-th column with constants
                const modifiedMatrix = matrix.map((row, rowIndex) =>
                    row.map((col, colIndex) => 
                        colIndex === i ? constants[rowIndex] : col
                    )
                );
                
                // Calculate determinant and solution
                const detModified = det(modifiedMatrix);
                const solution = detModified / detA;
                
                solutions.push({
                    variable: `x${i + 1}`,
                    value: solution,
                    determinant: detModified
                });
            }
            
            setResults(solutions);
        } catch (error) {
            alert(error.message || "Error in calculation. Please check your input values.");
            console.error("Calculation error:", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-3xl font-bold text-center mb-6">Cramer's Rule Calculator</h2>

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
                        onClick={calculateCramer}
                        className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        Calculate
                    </button>
                </div>

                {/* Main Determinant Display */}
                {mainDet !== null && (
                    <div className="text-center mb-6">
                        <h3 className="text-xl font-bold">Main Determinant: {mainDet.toFixed(6)}</h3>
                    </div>
                )}

                {/* Results Table */}
                {results.length > 0 && (
                    <table className="min-w-full table-auto text-center border-collapse border border-gray-800 mt-4">
                        <thead>
                            <tr className="bg-gray-800 text-white">
                                <th className="px-4 py-2 border border-gray-700">Variable</th>
                                <th className="px-4 py-2 border border-gray-700">Value</th>
                                <th className="px-4 py-2 border border-gray-700">Determinant</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((element, index) => (
                                <tr key={index} className={`bg-gray-100 hover:bg-gray-200 ${index % 2 === 0 ? "bg-gray-50" : ""}`}>
                                    <td className="border px-4 py-2">{element.variable}</td>
                                    <td className="border px-4 py-2">{element.value.toFixed(6)}</td>
                                    <td className="border px-4 py-2">{element.determinant.toFixed(6)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default CramerCalculator;
