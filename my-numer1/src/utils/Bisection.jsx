import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import MathEquation from "../components/MathEquation";
import NavbarComponent from "../components/Navbar";
import { evaluate } from 'mathjs';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
const BisectionMethod = () => {
    const [equation, setEquation] = useState("x^4-13");
    const [xl, setXL] = useState(0);
    const [xr, setXR] = useState(0);
    const [root, setRoot] = useState(0);
    const [iterations, setIterations] = useState([]);
    const navigate = useNavigate(); // Initialize useNavigate

    const error = (xOld, xNew) => Math.abs((xNew - xOld) / xNew) * 100;

    // Clear values when equation changes
    useEffect(() => {
        setRoot(0);
        setIterations([]);
    }, [equation]);

    const calculateBisection = (xl, xr) => {
        try {
            let xm, fXm, fXr, ea;
            let iter = 0;
            const tolerance = 0.00001;
            const newIterations = [];
    
            do {
                xm = (xl + xr) / 2.0; // Calculate Xm
                const scopeXr = { x: xr };
                const scopeXm = { x: xm };
                fXr = evaluate(equation, scopeXr);
                fXm = evaluate(equation, scopeXm);
                iter++;
                
                if (fXm * fXr > 0) {
                    ea = error(xr, xm);
                    newIterations.push({ iteration: iter, Xl: xl, Xm: xm, Xr: xr, Error: ea });
                    xr = xm; // Update XR
                } else {
                    ea = error(xl, xm);
                    newIterations.push({ iteration: iter, Xl: xl, Xm: xm, Xr: xr, Error: ea });
                    xl = xm; // Update XL
                }
            } while (ea > tolerance);
    
            setRoot(xm);
            setIterations(newIterations);
    
            // Log the calculation after it's done
            axios.post('https://numer-pt-03-ex-xmpx.vercel.app/api/insert', {   
                equation: equation,
                method: "Bisection",
                result: xm
            })
            .then(response => {
                
                if (response.status !== 200) {
                    throw new Error('Network response was not ok');
                }
                return response.data; 
            })
            .then(data => {
                console.log(data.msg); 
            })
            .catch(error => {
                console.error('Error logging calculation:', error);
            });
    
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
                        <h2 className="text-3xl font-bold mb-4">Bisection Method Calculator</h2>
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
                            onClick={() => calculateBisection(xl, xr)}
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
                            data={[{
                                x: iterations.map(iter => iter.Xm),
                                y: iterations.map(iter => evaluate(equation, { x: iter.Xm })),
                                type: "scatter",
                                mode: "lines+markers",
                                marker: { color: "blue" },
                                name: "f(x)",
                            }]}
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

export default BisectionMethod;
