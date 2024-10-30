import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import MathEquation from "../components/MathEquation";
import { evaluate } from 'mathjs';
import { useNavigate } from 'react-router-dom';

const GraphicalMethod = () => {
    const [equation, setEquation] = useState("x^2 - 4"); // Default equation
    const [xMin, setXMin] = useState(-10);
    const [xMax, setXMax] = useState(10);
    const [root, setRoot] = useState(null);
    const [iterations, setIterations] = useState([]);
    const navigate = useNavigate();

    // Function to find roots graphically
    const findRootGraphically = () => {
        const xValues = [];
        const yValues = [];
        const tolerance = 0.00001;

        for (let x = xMin; x <= xMax; x += 0.1) {
            const y = evaluate(equation, { x });
            xValues.push(x);
            yValues.push(y);
            if (Math.abs(y) < tolerance) {
                setRoot(x);
            }
        }

        setIterations(xValues.map((x, index) => ({
            x,
            y: yValues[index],
        })));
    };

    return (
        <>
            <div className="flex flex-col justify-center items-center border rounded p-4 mt-5 min-h-screen">
                <div className="flex flex-col justify-center items-center border rounded p-4">
                    <h2 className="text-3xl font-bold mb-4">Graphical Method Calculator</h2>

                    <form className="flex flex-col items-center space-y-4">
                        <label className="block">
                            <span className="text-lg">Input f(x)</span>
                            <input
                                type="text"
                                value={equation}
                                onChange={(e) => setEquation(e.target.value)}
                                className="form-input mt-1 block w-full border rounded p-2"
                            />
                        </label>
                        <label className="block">
                            <span className="text-lg">X Minimum</span>
                            <input
                                type="number"
                                value={xMin}
                                onChange={(e) => setXMin(parseFloat(e.target.value))}
                                className="form-input mt-1 block w-full border rounded p-2"
                            />
                        </label>
                        <label className="block">
                            <span className="text-lg">X Maximum</span>
                            <input
                                type="number"
                                value={xMax}
                                onChange={(e) => setXMax(parseFloat(e.target.value))}
                                className="form-input mt-1 block w-full border rounded p-2"
                            />
                        </label>
                        <button
                            type="button"
                            onClick={findRootGraphically}
                            className="bg-gray-800 text-white px-4 py-2 rounded"
                        >
                            Find Root
                        </button>
                    </form>

                    <div className="mb-2 font-bold text-2xl">
                        Equation: <MathEquation equation={`$f(x) = ${equation}$`} />
                    </div>

                    <div>
                        {root !== null && (
                            <h5 className="font-bold text-xl">Root = {root.toPrecision(7)}</h5>
                        )}
                    </div>

                    <button
                        onClick={() => navigate('/')} // Navigate back to menu
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
                                    x: iterations.map(iter => iter.x),
                                    y: iterations.map(iter => iter.y),
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
            </div>
        </>
    );
};

export default GraphicalMethod;
