import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    const [selectedMethod, setSelectedMethod] = useState('');
    const [selectedLinearMethod, setSelectedLinearMethod] = useState('');
    const [selectedRegressionMethod, setSelectedRegressionMethod] = useState('');
    const [selectedIntegrationMethod, setSelectedIntegrationMethod] = useState('');

    const handleMethodChange = (method) => {
        setSelectedMethod(method);
    };

    const handleLinearMethodChange = (method) => {
        setSelectedLinearMethod(method);
    };

    const handleRegressionMethodChange = (method) => {
        setSelectedRegressionMethod(method);
    };

    const handleIntegrationMethodChange = (method) => {
        setSelectedIntegrationMethod(method);
    };

    return (
        <div style={{ padding: '20px' }}>
            <header style={{ background: '#007BFF', color: '#fff', padding: '10px', textAlign: 'center' }}>
                <h1>Welcome to My Numerical Method Website</h1>
            </header>
            <main style={{ marginTop: '20px' }}>
                <h2 style={{ textAlign: 'center' }}>Choose Your Method to Calculate</h2>

                <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
                    {/* First Column: Non-linear Methods */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {['Graphical', 'Bisection', 'False Position', 'Newton Raphson', 'Secant', 'One-Point-Iteration'].map((method) => (
                            <Link to={`/${method.toLowerCase().replace(' ', '-')}`} key={method}>
                                <button
                                    style={{
                                        padding: '15px 30px',  // Increased padding for bigger buttons
                                        margin: '10px',
                                        border: 'none',
                                        borderRadius: '5px',
                                        background: selectedMethod === method ? '#007BFF' : '#f0f0f0',
                                        color: selectedMethod === method ? '#fff' : '#333',
                                        cursor: 'pointer',
                                        fontSize: '18px',  // Increased font size
                                        width: '250px',     // Increased width
                                        transition: 'background 0.3s',
                                    }}
                                    onClick={() => handleMethodChange(method)}
                                >
                                    {method}
                                </button>
                            </Link>
                        ))}
                    </div>

                    {/* Second Column: Linear Methods */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {['Cramer', 'Gaussian', 'Gauss Jordan', 'LU Decomposition', 'Cholesky', 'Jacobi', 'Gauss Seidel', 'Conjugate Gradient'].map((method) => (
                            <Link to={`/${method.toLowerCase().replace(' ', '-')}`} key={method}>
                                <button
                                    style={{
                                        padding: '15px 30px',  // Increased padding for bigger buttons
                                        margin: '10px',
                                        border: 'none',
                                        borderRadius: '5px',
                                        background: selectedLinearMethod === method ? '#007BFF' : '#f0f0f0',
                                        color: selectedLinearMethod === method ? '#fff' : '#333',
                                        cursor: 'pointer',
                                        fontSize: '18px',  // Increased font size
                                        width: '250px',     // Increased width
                                        transition: 'background 0.3s',
                                    }}
                                    onClick={() => handleLinearMethodChange(method)}
                                >
                                    {method}
                                </button>
                            </Link>
                        ))}
                    </div>

                    {/* New Column: Interpolation Methods */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {['Newton Interpolation', 'Lagrange Interpolation', 'Spline Interpolation'].map((method) => (
                            <Link to={`/${method.toLowerCase().replace(' ', '-')}`} key={method}>
                                <button
                                    style={{
                                        padding: '15px 30px',  // Increased padding for bigger buttons
                                        margin: '10px',
                                        border: 'none',
                                        borderRadius: '5px',
                                        background: '#f0f0f0',
                                        color: '#333',
                                        cursor: 'pointer',
                                        fontSize: '18px',  // Increased font size
                                        width: '250px',     // Increased width
                                        transition: 'background 0.3s',
                                    }}
                                >
                                    {method}
                                </button>
                            </Link>
                        ))}
                    </div>

                    {/* New Column: Regression Methods */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {['Multiple Regression', 'Polynomial Regression'].map((method) => (
                            <Link to={`/${method.toLowerCase().replace(' ', '-')}`} key={method}>
                                <button
                                    style={{
                                        padding: '15px 30px',  // Increased padding for bigger buttons
                                        margin: '10px',
                                        border: 'none',
                                        borderRadius: '5px',
                                        background: '#f0f0f0',
                                        color: '#333',
                                        cursor: 'pointer',
                                        fontSize: '18px',  // Increased font size
                                        width: '250px',     // Increased width
                                        transition: 'background 0.3s',
                                    }}
                                >
                                    {method}
                                </button>
                            </Link>
                        ))}
                    </div>

                    {/* New Column: Integration and Differential Methods */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {['Trapezoidal Integration', "Simpson's Integration", 'Differential'].map((method) => (
                            <Link to={`/${method.toLowerCase().replace(' ', '-')}`} key={method}>
                                <button
                                    style={{
                                        padding: '15px 30px',  // Increased padding for bigger buttons
                                        margin: '10px',
                                        border: 'none',
                                        borderRadius: '5px',
                                        background: selectedIntegrationMethod === method ? '#007BFF' : '#f0f0f0',
                                        color: selectedIntegrationMethod === method ? '#fff' : '#333',
                                        cursor: 'pointer',
                                        fontSize: '18px',  // Increased font size
                                        width: '250px',     // Increased width
                                        transition: 'background 0.3s',
                                    }}
                                    onClick={() => handleIntegrationMethodChange(method)}
                                >
                                    {method}
                                </button>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default HomePage;
