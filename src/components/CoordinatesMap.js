export const CoordinatesMap = ({ data }) => {
  // Esto sería reemplazado por un mapa real como Leaflet en una implementación completa
  return (
    <div className="mt-4 p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Coordinate Visualization</h3> {/* Translated */}
      <div className="h-64 bg-white border border-gray-300 flex items-center justify-center">
        <p className="text-gray-500">
          {data.length > 0 
            ? `Showing ${data.length} points (X: ${data[0].x.toFixed(2)} to ${data[data.length-1].x.toFixed(2)}, Y: ${data[0].y.toFixed(2)} to ${data[data.length-1].y.toFixed(2)})` // Translated
            : "No data to display"} {/* Translated */}
        </p>
      </div>
    </div>
  );
};

// DONE