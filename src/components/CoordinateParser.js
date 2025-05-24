import { useState } from 'react';

export const CoordinateParser = ({ onParse }) => {
  const [rawText, setRawText] = useState('');

  const handleParse = () => {
    // Primero normalizamos los saltos de línea y luego dividimos
    const lines = rawText
      .replace(/\r\n/g, '\n')  // Convertir Windows CRLF a LF
      .replace(/\r/g, '\n')    // Convertir Mac CR a LF
      .split('\n')
      .filter(line => line.trim() !== '');  // Filtrar líneas vacías
    
    const parsed = lines.map(line => {
      // Extraemos los valores separados por espacios o tabs
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
    <div className="p-4 bg-white rounded-lg shadow">
      <textarea
        className="w-full p-2 border border-gray-300 rounded mb-2 font-mono"
        rows="5"
        placeholder="Pega aquí las coordenadas SOP desde Excel (separadas por tabs o espacios)"
        value={rawText}
        onChange={(e) => setRawText(e.target.value)}
      />
      <button
        onClick={handleParse}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Procesar Coordenadas
      </button>
    </div>
  );
};