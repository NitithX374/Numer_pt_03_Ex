// MatrixInput.jsx
import React from 'react';

export const MatrixInput = ({ size, matrix, constants, onMatrixChange, onConstantChange }) => (
    <div>
        <h3 className="text-xl font-bold mb-2">Input Matrix</h3>
        {matrix.map((row, rowIndex) => (
            <div key={rowIndex} className="flex space-x-2">
                {row.map((value, colIndex) => (
                    <input
                        key={colIndex}
                        type="number"
                        value={value}
                        onChange={(e) => onMatrixChange(rowIndex, colIndex, e.target.value)}
                        className="border border-gray-300 p-2 rounded"
                    />
                ))}
            </div>
        ))}
        <h3 className="text-xl font-bold mb-2 mt-4">Input Constants</h3>
        {constants.map((value, index) => (
            <input
                key={index}
                type="number"
                value={value}
                onChange={(e) => onConstantChange(index, e.target.value)}
                className="border border-gray-300 p-2 rounded mb-2"
            />
        ))}
    </div>
);
