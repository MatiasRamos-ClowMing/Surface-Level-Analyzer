import { useState } from 'react';

export const MeasurementParser = ({ onParse }) => {
  const [rawText, setRawText] = useState('');

  const handleParse = () => {
    const lines = rawText
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .split('\n')
      .filter(line => line.trim() !== '');
    
    const parsed = lines.map(line => {
      const parts = line.trim().split(/\s+/).filter(part => part !== '');
      return {
        id: parts[0],
        x: parseFloat(parts[1]),
        y: parseFloat(parts[2]),
        z: parseFloat(parts[3])
      };
    });
    onParse(parsed);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow mt-4">
      <h3 className="text-lg font-semibold mb-2">Ingrese Mediciones Topográficas</h3>
      <textarea
        className="w-full p-2 border border-gray-300 rounded mb-2 font-mono"
        rows="5"
        placeholder="Pega aquí las mediciones desde Excel (separadas por tabs o espacios)"
        value={rawText}
        onChange={(e) => setRawText(e.target.value)}
      />
      <button
        onClick={handleParse}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
      >
        Procesar Mediciones
      </button>
    </div>
  );
};

// DONE