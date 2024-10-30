import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import MathEquation from "../components/MathEquation";
import NavbarComponent from "../components/Navbar";
import { evaluate } from 'mathjs';
import { useNavigate } from 'react-router-dom';

const FalsePositionMethod = () => {
    const [equation, setEquation] = useState("x^4-13");
    const [xl, setXL] = useState(0);
    const [xr, setXR] = useState(0);
    const [root, setRoot] = useState(0);
    const [iterations, setIterations] = useState([]);

    const navigate = useNavigate();

    const error = (xOld, xNew) => Math.abs((xNew - xOld) / xNew) * 100;

    useEffect(() => {
        // Reset all values when the equation changes
        setXL(0);
        setXR(0);
        setRoot(0);
        setIterations([]);
    }, [equation]);

    const calculateFalsePosition = () => {
        try {
            let xm, fXm, fXl, fXr, ea;
            let iter = 0;
            const tolerance = 0.00001;
            const newIterations = [];

            let tempXL = xl;
            let tempXR = xr;

            do {
                const scopeXl = { x: tempXL };
                const scopeXr = { x: tempXR };
                fXl = evaluate(equation, scopeXl);
                fXr = evaluate(equation, scopeXr);

                xm = tempXR - (fXr * (tempXL - tempXR)) / (fXl - fXr);
                const scopeXm = { x: xm };
                fXm = evaluate(equation, scopeXm);
                iter++;

                if (fXm * fXr < 0) {
                    tempXL = xm;
                } else {
                    tempXR = xm;
                }

                ea = error(tempXR, xm);
                newIterations.push({ iteration: iter, Xl: tempXL, Xm: xm, Xr: tempXR, Error: ea });

            } while (ea > tolerance);

            setRoot(xm);
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
                    <h2 className="text-3xl font-bold mb-4">False Position Method Calculator</h2>

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
                            <span className="text-lg">Input XL</span>
                            <input
                                type="number"
                                id="XL"
                                value={xl}
                                onChange={(e) => setXL(parseFloat(e.target.value))}
                                className="form-input mt-1 block w-full border rounded p-2"
                            />
                        </label>
                        <label className="block">
                            <span className="text-lg">Input XR</span>
                            <input
                                type="number"
                                id="XR"
                                value={xr}
                                onChange={(e) => setXR(parseFloat(e.target.value))}
                                className="form-input mt-1 block w-full border rounded p-2"
                            />
                        </label>
                        <button
                            type="button"
                            onClick={calculateFalsePosition}
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

                    <button
                        onClick={() => navigate('/')}
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
                                    x: iterations.map(iter => iter.Xm),
                                    y: iterations.map(iter => evaluate(equation, { x: iter.Xm })),
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
                                <th className="px-4 py-2 border border-gray-700">XL</th>
                                <th className="px-4 py-2 border border-gray-700">XM</th>
                                <th className="px-4 py-2 border border-gray-700">XR</th>
                                <th className="px-4 py-2 border border-gray-700">Error</th>
                            </tr>
                        </thead>
                        <tbody>
                            {iterations.map((element, index) => (
                                <tr key={index} className={`bg-gray-100 hover:bg-gray-200 ${index % 2 === 0 ? "bg-gray-50" : ""}`}>
                                    <td className="border px-4 py-2">{element.iteration}</td>
                                    <td className="border px-4 py-2">{element.Xl.toPrecision(7)}</td>
                                    <td className="border px-4 py-2">{element.Xm.toPrecision(7)}</td>
                                    <td className="border px-4 py-2">{element.Xr.toPrecision(7)}</td>
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

export default FalsePositionMethod;
