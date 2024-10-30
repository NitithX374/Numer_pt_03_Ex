import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import MathEquation from "../components/MathEquation";
import { evaluate } from 'mathjs';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const SecantMethod = () => {
    const [equation, setEquation] = useState("x^4-13");
    const [x0, setX0] = useState(0);
    const [x1, setX1] = useState(1);
    const [root, setRoot] = useState(0);
    const [iterations, setIterations] = useState([]);

    const navigate = useNavigate(); // Initialize useNavigate

    const error = (xOld, xNew) => Math.abs((xNew - xOld) / xNew) * 100;

    // Clear values when equation changes
    useEffect(() => {
        setRoot(0);
        setIterations([]);
    }, [equation]);

    const calculateSecant = (x0, x1) => {
        try {
            let xNew;
            let fX0, fX1, ea;
            let iter = 0;
            const tolerance = 0.00001;
            const newIterations = [];

            do {
                const scopeX0 = { x: x0 };
                const scopeX1 = { x: x1 };

                fX0 = evaluate(equation, scopeX0); // Evaluate f(x0)
                fX1 = evaluate(equation, scopeX1); // Evaluate f(x1)

                // Calculate new guess using Secant formula
                xNew = x1 - (fX1 * (x1 - x0)) / (fX1 - fX0);
                iter++;

                ea = error(x1, xNew);
                newIterations.push({ iteration: iter, X: xNew, Error: ea });

                // Update x0 and x1 for the next iteration
                x0 = x1;
                x1 = xNew;

            } while (ea > tolerance);

            setRoot(xNew);
            setIterations(newIterations);
        } catch (err) {
            console.error("Error in calculation:", err);
            setRoot(0);
            setIterations([]);
        }
    };

    return (
        <>
            <div className="flex flex-col justify-center items-center border rounded p-4 mt-5 min-h-screen">
                <div className="flex flex-col justify-center items-center border rounded p-4">
                    <div className="flex flex-col items-center">
                        <h2 className="text-3xl font-bold mb-4">Secant Method Calculator</h2>
                    </div>

                    <form className="flex flex-col items-center space-y-4">
                        <label className="block">
                            <span className="text-lg">Input f(x)</span>
                            <input
                                type="text"
                                id="equation"
                                value={equation}
                                onChange={(e) => setEquation(e.target.value)}
                                className="form-input mt-1 block w-full border rounded p-2"
                            />
                        </label>
                        <label className="block">
                            <span className="text-lg">Input X0</span>
                            <input
                                type="number"
                                id="X0"
                                value={x0}
                                onChange={(e) => setX0(parseFloat(e.target.value))}
                                className="form-input mt-1 block w-full border rounded p-2"
                            />
                        </label>
                        <label className="block">
                            <span className="text-lg">Input X1</span>
                            <input
                                type="number"
                                id="X1"
                                value={x1}
                                onChange={(e) => setX1(parseFloat(e.target.value))}
                                className="form-input mt-1 block w-full border rounded p-2"
                            />
                        </label>
                        <button
                            type="button"
                            onClick={() => calculateSecant(x0, x1)}
                            className="bg-gray-800 text-white px-4 py-2 rounded"
                        >
                            Calculate
                        </button>
                    </form>
                    <br />
                    <div className="mb-2 font-bold text-2xl">
                        Equation:{" "}
                        {<MathEquation equation={`$${"f(x)"}=$ $${equation}$`} />}
                    </div>

                    <div>
                        <h5 className="font-bold text-xl">Answer = {root.toPrecision(7)}</h5>
                    </div>

                    {/* Add Back to Menu Button */}
                    <button
                        onClick={() => navigate('/')} // Navigate to the home page
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Back to Menu
                    </button>
                </div>

                <div className="flex flex-col justify-center items-center mt-4 w-full">
                    <h3 className="text-3xl font-bold mb-4">Graph</h3>
                    <div className="w-full flex justify-center overflow-hidden overflow-x-auto">
                        <Plot
                            data={[
                                {
                                    x: iterations.map(iter => iter.X),
                                    y: iterations.map(iter => evaluate(equation, { x: iter.X })),
                                    type: "scatter",
                                    mode: "lines+markers",
                                    marker: { color: "blue" },
                                    name: "f(x)",
                                },
                            ]}
                            layout={{
                                title: "Function Plot",
                                xaxis: { title: "X Values" },
                                yaxis: { title: "f(x)" },
                                autosize: true,
                                width: window.innerWidth < 768 ? window.innerWidth - 40 : undefined,
                            }}
                        />
                    </div>
                </div>

                <div className="flex flex-col justify-center items-center mt-4 w-full overflow-x-auto">
                    <table className="min-w-full table-auto text-center border-collapse border border-gray-800">
                        <thead>
                            <tr className="bg-gray-800 text-white">
                                <th className="px-4 py-2 border border-gray-700">Iteration</th>
                                <th className="px-4 py-2 border border-gray-700">X</th>
                                <th className="px-4 py-2 border border-gray-700">Error</th>
                            </tr>
                        </thead>
                        <tbody>
                            {iterations.map((element, index) => (
                                <tr key={index} className={`bg-gray-100 hover:bg-gray-200 ${index % 2 === 0 ? "bg-gray-50" : ""}`}>
                                    <td className="border px-4 py-2">{element.iteration}</td>
                                    <td className="border px-4 py-2">{element.X.toPrecision(7)}</td>
                                    <td className="border px-4 py-2">{element.Error.toFixed(6)}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default SecantMethod;
