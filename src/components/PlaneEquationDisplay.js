import React from 'react';

const PlaneEquationDisplay = ({ equation }) => {
  const formatTerm = (value, variable) => {
    if (value === 0) return '';
    const absValue = Math.abs(value);
    const sign = value > 0 ? '+' : '-';
    return ` ${sign} ${absValue.toFixed(3)}${variable}`;
  };

  return (
    <div className="mt-4 p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2 text-center">Plane Equation</h3> {/* Translated */}
      <div className="text-center p-2 bg-gray-50 rounded overflow-x-auto">
        <p className="text-sm font-mono whitespace-nowrap">
          {equation.A.toFixed(3)}x 
          {formatTerm(equation.B, 'y')} 
          {formatTerm(equation.C, 'z')} 
          {formatTerm(equation.D, '')} = 0
        </p>
      </div>
    </div>
  );
};

export { PlaneEquationDisplay };

// DONE