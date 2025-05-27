import { useState } from 'react';
import { forwardRef, useImperativeHandle } from 'react';

const MeasurementParser = forwardRef(({ onParse }, ref) => {
  const [rawText, setRawText] = useState('');

  useImperativeHandle(ref, () => ({
    clearText() {
      setRawText('');
    },
    setText(text) {
      setRawText(text);
    }
  }));

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
      <h3 className="text-lg font-semibold mb-2">Enter Topographic Measurements</h3>
      <textarea
        className="w-full p-2 border border-gray-300 rounded mb-2 font-mono"
        rows="15" // Changed from 5 to 15
        placeholder="Paste measurements from Excel (separated by tabs or spaces)"
        value={rawText}
        onChange={(e) => setRawText(e.target.value)}
      />
      <button
        onClick={handleParse}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
      >
        Process Survey
      </button>
    </div>
  );
});

export { MeasurementParser };

// DONE