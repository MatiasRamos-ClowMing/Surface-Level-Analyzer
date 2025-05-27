import { useState } from 'react';
import { forwardRef, useImperativeHandle } from 'react';

const CoordinateParser = forwardRef(({ onParse }, ref) => {
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
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">Enter SOP Coordinates</h3>
      <textarea
        className="w-full p-2 border border-gray-300 rounded mb-2 font-mono"
        rows="12" // Changed from 15 to 12
        placeholder="Paste SOP coordinates from Excel (separated by tabs or spaces)"
        value={rawText}
        onChange={(e) => setRawText(e.target.value)}
      />
      <button
        onClick={handleParse}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Process Coordinates
      </button>
    </div>
  );
});

export { CoordinateParser };

// DONE