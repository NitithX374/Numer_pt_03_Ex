import React, { useState } from "react";
import Plot from "react-plotly.js";
import MathEquation from "../components/MathEquation";
import { evaluate } from "mathjs";

const OnePointIterationMethod = () => {
    const [equation, setEquation] = useState("(1 / 2) * (x + 7 / x)"); // Example: g(x)
    const [initialX, setInitialX] = useState(2);
    const [root, setRoot] = useState(0);
    const [iterations, setIterations] = useState([]);

    const error = (xOld, xNew) => Math.abs((xNew - xOld) / xNew) * 100;

    const calculateOnePointIteration = (x0) => {
        let x = x0;
        let xPrev;
        let iter = 0;
        const tolerance = 0.00001;
        const maxIter = 100;
        const newIterations = [];

        do {
            xPrev = x;

            // Calculate g(x)
            const gx = evaluate(equation, { x: x });
            x = gx; // Update x with g(x)

            iter++;
            newIterations.push({
                iteration: iter,
                xPrev: xPrev,
                x: x,
                gx: gx,
                error: error(xPrev, x)
            });

            if (iter >= maxIter) {
                console.log("Maximum iterations reached");
                break;
            }
        } while (error(xPrev, x) > tolerance);

        setRoot(x);
        setIterations(newIterations);
    };

    // Generate points for plotting g(x) and y=x
    const generatePlotPoints = () => {
        const points = [];
        const start = Math.min(...iterations.map(iter => iter.x)) - 2;
        const end = Math.max(...iterations.map(iter => iter.x)) + 2;
        const step = (end - start) / 200;

        for (let x = start; x <= end; x += step) {
            try {
                const gx = evaluate(equation, { x: x });
                points.push({ x: x, gx: gx });
            } catch (error) {
                continue; // Ignore errors for out-of-bound values
            }
        }
        return points;
    };

    return (
        <>
            <div className="flex flex-col justify-center items-center border rounded p-4 mt-5 min-h-screen">
                <div className="flex flex-col justify-center items-center border rounded p-4">
                    <h2 className="text-3xl font-bold mb-4">One-Point Iteration Method Calculator</h2>
                    <form className="flex flex-col items-center space-y-4">
                        <label className="block">
                            <span className="text-lg">Input g(x)</span>
                            <input
                                type="text"
                                value={equation}
                                onChange={(e) => setEquation(e.target.value)}
                                className="form-input mt-1 block w-full border rounded p-2"
                            />
                        </label>
                        <label className="block">
                            <span className="text-lg">Initial Guess (x₀)</span>
                            <input
                                type="number"
                                value={initialX}
                                onChange={(e) => setInitialX(parseFloat(e.target.value))}
                                className="form-input mt-1 block w-full border rounded p-2"
                            />
                        </label>
                        <button
                            type="button"
                            onClick={() => calculateOnePointIteration(initialX)}
                            className="bg-gray-800 text-white px-4 py-2 rounded"
                        >
                            Calculate
                        </button>
                    </form>
                    <div className="mb-2 font-bold text-2xl">
                        Iteration Function:{" "}
                        {<MathEquation equation={`$g(x) = ${equation}$`} />}
                    </div>
                    <div>
                        <h5 className="font-bold text-xl">Root = {root.toPrecision(7)}</h5>
                    </div>
                </div>

                <div className="flex flex-col justify-center items-center mt-4 w-full">
                    <h3 className="text-3xl font-bold mb-4">Graph</h3>
                    <div className="w-full flex justify-center overflow-hidden overflow-x-auto">
                        <Plot
                            data={[
                                // g(x) curve
                                {
                                    x: generatePlotPoints().map(p => p.x),
                                    y: generatePlotPoints().map(p => p.gx),
                                    type: "scatter",
                                    mode: "lines",
                                    line: { color: 'rgb(0, 114, 189)', width: 2 },
                                    name: `g(x) = ${equation}`
                                },
                                // y = x line
                                {
                                    x: [-10, 10],
                                    y: [-10, 10],
                                    type: "scatter",
                                    mode: "lines",
                                    line: { color: 'black', width: 2 },
                                    name: "y = x"
                                },
                                // Iteration steps (stair pattern)
                                {
                                    x: iterations.flatMap(iter => [iter.xPrev, iter.xPrev]),
                                    y: iterations.flatMap(iter => [iter.xPrev, iter.gx]),
                                    type: "scatter",
                                    mode: "lines",
                                    line: { color: 'red', width: 2 },
                                    name: "Iteration",
                                    showlegend: true
                                },
                                // Vertical lines of the stairs
                                {
                                    x: iterations.slice(0, -1).flatMap((iter, i) => [iter.xPrev, iterations[i + 1].xPrev]),
                                    y: iterations.slice(0, -1).flatMap(iter => [iter.gx, iter.gx]),
                                    type: "scatter",
                                    mode: "lines",
                                    line: { color: 'red', width: 2 },
                                    showlegend: false
                                }
                            ]}
                            layout={{
                                title: "One-Point Iteration Method",
                                xaxis: {
                                    title: "x values",
                                    gridcolor: 'lightgray',
                                    zerolinecolor: 'lightgray',
                                    dtick: 0.5,
                                    range: [1, 4]
                                },
                                yaxis: {
                                    title: "g(x)",
                                    gridcolor: 'lightgray',
                                    zerolinecolor: 'lightgray',
                                    dtick: 0.5,
                                    range: [1, 4]
                                },
                                plot_bgcolor: 'white',
                                paper_bgcolor: 'white',
                                showlegend: true,
                                legend: {
                                    x: 1.1,
                                    y: 1,
                                    xanchor: 'left',
                                    yanchor: 'top',
                                    bgcolor: 'rgba(255,255,255,0)',
                                    bordercolor: 'rgba(255,255,255,0)'
                                },
                                width: 900,
                                height: 500,
                                margin: {
                                    t: 50,
                                    r: 150,
                                    b: 50,
                                    l: 50
                                }
                            }}
                            config={{ responsive: true }}
                        />
                    </div>
                </div>

                <div className="flex flex-col justify-center items-center mt-4 w-full overflow-x-auto">
                    <table className="min-w-full table-auto text-center border-collapse border border-gray-800">
                        <thead>
                            <tr className="bg-gray-800 text-white">
                                <th className="px-4 py-2 border border-gray-700">Iteration</th>
                                <th className="px-4 py-2 border border-gray-700">xᵢ</th>
                                <th className="px-4 py-2 border border-gray-700">g(xᵢ)</th>
                                <th className="px-4 py-2 border border-gray-700">Error (%)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {iterations.map((element, index) => (
                                <tr key={index} className={`bg-gray-100 hover:bg-gray-200 ${index % 2 === 0 ? "bg-gray-50" : ""}`}>
                                    <td className="border px-4 py-2">{element.iteration}</td>
                                    <td className="border px-4 py-2">{element.xPrev.toPrecision(7)}</td>
                                    <td className="border px-4 py-2">{element.gx.toPrecision(7)}</td>
                                    <td className="border px-4 py-2">{element.error.toPrecision(7)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default OnePointIterationMethod;
