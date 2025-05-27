import React, { useState } from 'react';

const PrintOptionsModal = ({ isOpen, onClose, onPrint, elements }) => {
  const [selectedElements, setSelectedElements] = useState(
    elements.reduce((acc, el) => ({ ...acc, [el.id]: true }), {})
  );
  const [pageFormat, setPageFormat] = useState('A4');
  const [margins, setMargins] = useState(10); // in mm

  if (!isOpen) return null;

  const handleCheckboxChange = (id) => {
    setSelectedElements({
      ...selectedElements,
      [id]: !selectedElements[id],
    });
  };

  const handlePrintClick = () => {
    const elementsToPrint = elements.filter(el => selectedElements[el.id]);
    onPrint(elementsToPrint, { pageFormat, margins });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Print Options</h3>
          <div className="mt-2 px-7 py-3 text-left text-sm text-gray-500 overflow-y-auto max-h-96">
            <h4 className="font-semibold mb-2">Select Elements to Print:</h4>
            <div className="space-y-2 mb-4">
              {elements.map(el => (
                <label key={el.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedElements[el.id]}
                    onChange={() => handleCheckboxChange(el.id)}
                    className="form-checkbox"
                  />
                  <span className="ml-2">{el.name}</span>
                </label>
              ))}
            </div>

            <h4 className="font-semibold mb-2">Page Setup:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Page Format:</label>
                <select
                  value={pageFormat}
                  onChange={(e) => setPageFormat(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="A4">A4</option>
                  {/* Add other formats if needed */}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Margins (mm):</label>
                <input
                  type="number"
                  value={margins}
                  onChange={(e) => setMargins(Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded"
                  min="0"
                />
              </div>
            </div>
            {/* Resolution control is complex in web printing, often handled by browser/CSS */}
            {/* <h4 className="font-semibold mb-2">Resolution (DPI):</h4>
            <p className="text-xs text-gray-500">Resolution is typically handled by browser and CSS print styles.</p> */}

          </div>

          <div className="items-center px-4 py-3 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={handlePrintClick}
              disabled={Object.values(selectedElements).every(isSelected => !isSelected)}
              className={`px-4 py-2 text-base font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${Object.values(selectedElements).every(isSelected => !isSelected) ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
            >
              Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintOptionsModal;