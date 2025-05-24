import { useState, useMemo } from 'react';
import DeviationChart from './DeviationChart';

export const ComparisonResults = ({ sopCoordinates, verticalDistances }) => {
  const [upperTolerance, setUpperTolerance] = useState(5);
  const [lowerTolerance, setLowerTolerance] = useState(5);
  const [activeFilter, setActiveFilter] = useState('all');
  const [highlightedPointId, setHighlightedPointId] = useState(null);
  const [copySuccess, setCopySuccess] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  // Cálculo de promedios
  const averageDistance = useMemo(() => {
    const sum = verticalDistances.reduce((total, point) => total + point.verticalDistance, 0);
    return sum / verticalDistances.length;
  }, [verticalDistances]);

  const absoluteAverage = useMemo(() => {
    const sum = verticalDistances.reduce((total, point) => total + Math.abs(point.verticalDistance), 0);
    return sum / verticalDistances.length;
  }, [verticalDistances]);

  // Precalcular estados de puntos medidos
  const measuredPointsWithStatus = useMemo(() => {
    return verticalDistances.map(point => {
      const deviation = Math.round(point.verticalDistance);
      const isAbove = deviation > averageDistance + upperTolerance;
      const isBelow = deviation < averageDistance - lowerTolerance;
      
      return {
        ...point,
        deviation,
        status: isAbove ? 'above' : isBelow ? 'below' : 'within'
      };
    });
  }, [verticalDistances, averageDistance, upperTolerance, lowerTolerance]);

  // Filtramos puntos según estado
  const filteredMeasuredPoints = useMemo(() => {
    if (activeFilter === 'all') return measuredPointsWithStatus;
    return measuredPointsWithStatus.filter(point => point.status === activeFilter);
  }, [measuredPointsWithStatus, activeFilter]);

  // Ordenar puntos filtrados
  const sortedFilteredPoints = useMemo(() => {
    let sortableItems = [...filteredMeasuredPoints];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredMeasuredPoints, sortConfig]);


  // Contar puntos por estado
  const pointsCount = useMemo(() => {
    return measuredPointsWithStatus.reduce((acc, point) => {
      if (point.status === 'above') acc.above++;
      if (point.status === 'below') acc.below++;
      return acc;
    }, { above: 0, below: 0 });
  }, [measuredPointsWithStatus]);

  const handleRowClick = (pointId) => {
    setHighlightedPointId(pointId);
  };

  const copyTableToClipboard = () => {
    const header = ['ID', 'X', 'Y', 'Z (m)', 'Desv. (mm)', 'Estado'].join('\t');
    const rows = sortedFilteredPoints.map(point => {
      const statusText = point.status === 'above' ? 'Superior' : point.status === 'below' ? 'Inferior' : 'Dentro';
      return [
        point.id,
        point.x.toFixed(3),
        point.y.toFixed(3),
        point.z.toFixed(3),
        point.deviation,
        statusText
      ].join('\t');
    }).join('\n');

    const textToCopy = `${header}\n${rows}`;

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopySuccess('¡Copiado!');
      setTimeout(() => setCopySuccess(''), 2000);
    }).catch(err => {
      setCopySuccess('Error al copiar');
      console.error('Error copying to clipboard:', err);
    });
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="mt-6 space-y-4">
      {/* Panel de Promedios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Desviación Promedio</h3>
          <p className="text-xl">{Math.round(averageDistance)} mm</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Desviación Absoluta Promedio</h3>
          <p className="text-xl">{Math.round(absoluteAverage)} mm</p>
        </div>
      </div>

      {/* Panel de Tolerancias */}
      <div className="p-4 bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-3">Parámetros de Tolerancia</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Límite Superior (+mm)</label>
            <div className="flex items-center">
              <input
                type="range"
                value={upperTolerance}
                onChange={(e) => setUpperTolerance(Number(e.target.value))}
                className="w-full mr-3"
                min="0"
                max="20"
                step="1"
              />
              <span className="w-12 text-center font-mono bg-gray-100 px-2 py-1 rounded">{upperTolerance}</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Límite Inferior (-mm)</label>
            <div className="flex items-center">
              <input
                type="range"
                value={lowerTolerance}
                onChange={(e) => setLowerTolerance(Number(e.target.value))}
                className="w-full mr-3"
                min="0"
                max="20"
                step="1"
              />
              <span className="w-12 text-center font-mono bg-gray-100 px-2 py-1 rounded">{lowerTolerance}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Panel de Filtros */}
      <div className="p-4 bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-3">Filtros de Visualización</h3>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setActiveFilter('all')} className={`btn-filter ${activeFilter === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}>
            👁️ Todos ({measuredPointsWithStatus.length})
          </button>
          <button onClick={() => setActiveFilter('within')} className={`btn-filter ${activeFilter === 'within' ? 'bg-green-600 text-white' : 'bg-green-100'}`}>
            ✅ Dentro ({measuredPointsWithStatus.length - pointsCount.above - pointsCount.below})
          </button>
          <button onClick={() => setActiveFilter('above')} className={`btn-filter ${activeFilter === 'above' ? 'bg-red-600 text-white' : 'bg-red-100'}`}>
            🔴 Superior ({pointsCount.above})
          </button>
          <button onClick={() => setActiveFilter('below')} className={`btn-filter ${activeFilter === 'below' ? 'bg-blue-600 text-white' : 'bg-blue-100'}`}>
            🔵 Inferior ({pointsCount.below})
          </button>
        </div>
      </div>

      {/* Gráfico */}
      <DeviationChart 
        sopPoints={sopCoordinates}
        measuredPoints={sortedFilteredPoints}
        average={averageDistance}
        upperTol={upperTolerance}
        lowerTol={lowerTolerance}
        highlightedPointId={highlightedPointId}
      />
      
      {/* Tabla de resultados */}
      <div className="overflow-x-auto">
        <div className="flex justify-between items-center mb-2">
           <h3 className="text-lg font-semibold">Resultados de Desviación</h3>
           <button
             onClick={copyTableToClipboard}
             className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
           >
             📋 Copiar para Excel
           </button>
        </div>
        {copySuccess && <p className="text-green-600 text-sm mb-2">{copySuccess}</p>}
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">X</th>
              <th className="px-4 py-2">Y</th>
              <th className="px-4 py-2">Z (m)</th>
              <th 
                className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                onClick={() => requestSort('deviation')}
              >
                Desv. (mm) {sortConfig.key === 'deviation' ? (sortConfig.direction === 'ascending' ? ' ↑' : ' ↓') : ''}
              </th>
              <th className="px-4 py-2">Estado</th>
            </tr>
          </thead>
          <tbody>
            {sortedFilteredPoints.map(point => (
              <tr 
                key={point.id} 
                className={`border-t hover:bg-gray-100 cursor-pointer ${highlightedPointId === point.id ? 'bg-yellow-100' : ''}`}
                onClick={() => handleRowClick(point.id)}
              >
                <td className="px-4 py-2 text-center">{point.id}</td>
                <td className="px-4 py-2 font-mono text-center">{point.x.toFixed(3)}</td>
                <td className="px-4 py-2 font-mono text-center">{point.y.toFixed(3)}</td>
                <td className="px-4 py-2 font-mono text-center">{point.z.toFixed(3)}</td>
                <td className={`px-4 py-2 font-mono text-center ${
                  point.status === 'above' ? 'text-red-600 font-bold' :
                  point.status === 'below' ? 'text-blue-600 font-bold' : 'text-gray-800'
                }`}>{point.deviation}</td>
                <td className={`px-4 py-2 text-center ${
                  point.status === 'above' ? 'bg-red-100 text-red-800' :
                  point.status === 'below' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                }`}> {/* Añadimos clases de fondo y texto */}
                  {point.status === 'above' ? (
                    <span className="font-medium">↑ Superior</span>
                  ) : point.status === 'below' ? (
                    <span className="font-medium">↓ Inferior</span>
                  ) : (
                    <span className="font-medium">✓ Ok</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// DONE