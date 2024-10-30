// src/utils/PlotGraph.js
import React from 'react';
import Plot from 'react-plotly.js';
import { create, all } from 'mathjs';

const math = create(all);

function PlotGraph({ funcString = 'x^2 - 4', root = 2 }) {
    let safeFunc;
    try {
        safeFunc = math.compile(funcString);
    } catch (error) {
        console.error("Error compiling the function:", error);
        return <p>Error: Invalid function string.</p>;
    }

    const xValues = Array.from({ length: 100 }, (_, i) => i / 10 - 5); // x-values from -5 to 5
    const yValues = xValues.map(x => {
        try {
            return safeFunc.evaluate({ x });
        } catch (error) {
            console.error(`Error evaluating function at x=${x}:`, error);
            return NaN;
        }
    });

    let rootY = NaN;
    if (typeof root === 'number') {
        try {
            rootY = safeFunc.evaluate({ x: root });
        } catch (error) {
            console.error("Error evaluating root:", error);
        }
    }

    return (
        <Plot
            data={[
                {
                    x: xValues,
                    y: yValues,
                    type: 'scatter',
                    mode: 'lines',
                    name: `f(x) = ${funcString}`,
                    line: { color: 'blue' },
                },
                {
                    x: [root],
                    y: [rootY],
                    type: 'scatter',
                    mode: 'markers',
                    name: 'Root',
                    marker: { color: 'red', size: 10 },
                },
            ]}
            layout={{
                title: 'Function Plot',
                xaxis: { title: 'X-Axis', range: [-5, 5] },
                yaxis: { title: 'f(X)', range: [-10, 10] },
                showlegend: true,
            }}
        />
    );
}

export default PlotGraph;
