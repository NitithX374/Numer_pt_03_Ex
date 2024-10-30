import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import BisectionMethod from './utils/Bisection';
import GraphicalMethod from './utils/graphicalMethod'; // Import your new component
import FalsePositionMethod from './utils/FalsePositionMethod';
import NewtonRaphsonMethod from './utils/NewtonRaphson';
import SecantMethod from './utils/Secant';
import OPI from './utils/OPI';
import CramerCalculator from './utils/CramerRule';
import GaussianCalculator from './utils/Gaussian';
import GaussJordanCalculator from './utils/GaussJordan';
import JacobiCalculator from './utils/Jacobi';
import GaussSeidelCalculator from './utils/GaussSeidel';
import NewtonInterpolationCalculator from './utils/Newton_DD_Interpolation';
import LagrangeInterpolationCalculator from './utils/Lagrange_Interpolation';
import SplineInterpolationCalculator from './utils/splineInterpolation';
import TrapezoidalRuleCalculator from './utils/Trapezoidal_integration';
import SimpsonsRuleCalculator from './utils/Simpson_Integration';
const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/bisection" element={<BisectionMethod />} />
                <Route path="/graphical" element={<GraphicalMethod />} />
                <Route path="/false-position" element={<FalsePositionMethod/>} />
                <Route path="/newton-raphson" element ={<NewtonRaphsonMethod/>} />
                <Route path="/secant" element ={<SecantMethod/>} />
                <Route path="/one-point-iteration" element={<OPI/>} />
                <Route path="cramer" element={<CramerCalculator/>} />
                <Route path="gaussian" element={<GaussianCalculator/>} />
                <Route path="gauss-jordan" element={<GaussJordanCalculator/>} />
                <Route path="jacobi" element={<JacobiCalculator/>} />
                <Route path="gauss-seidel" element={<GaussSeidelCalculator/>} />
                <Route path="newton-interpolation" element={<NewtonInterpolationCalculator/>} />
                <Route path="lagrange-interpolation" element={<LagrangeInterpolationCalculator/>} />
                <Route path="spline-interpolation" element={<SplineInterpolationCalculator/>} />
                <Route path="trapezoidal-integration" element={<TrapezoidalRuleCalculator/>} />
                <Route path="simpson's-integration" element={<SimpsonsRuleCalculator/>} />
            </Routes>
        </Router>
    );
};

export default App;
