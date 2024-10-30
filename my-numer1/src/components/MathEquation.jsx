import React from 'react';
import 'katex/dist/katex.min.css';
import Latex from '@matejmazur/react-katex';

const MathEquation = ({ equation }) => {
  // Function to clean up the equation string
  const cleanEquation = (eq) => {
    return eq
      // Remove unnecessary dollar signs
      .replace(/\$+/g, '')
      // Add proper spacing around =
      .replace(/=/g, ' = ')
      // Clean up exponents
      .replace(/\^(\d+)/g, '^{$1}');
  };

  const renderEquation = (eq) => {
    try {
      return <Latex>{cleanEquation(eq)}</Latex>;
    } catch (error) {
      console.error('KaTeX parsing error:', error);
      return <div className="text-red-500">Error rendering equation: {error.message}</div>;
    }
  };

  return (
    <div className="p-4">
      {renderEquation(equation)}
    </div>
  );
};

export default MathEquation;
