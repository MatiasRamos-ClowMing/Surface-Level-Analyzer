import React, { useState, useMemo, useRef, useEffect, forwardRef } from 'react';
import DeviationChart from './DeviationChart';

const ComparisonResults = forwardRef(({ sopCoordinates, verticalDistances }, ref) => {
  const [upperTolerance, setUpperTolerance] = useState(5);
  const [lowerTolerance, setLowerTolerance] = useState(5);
  const [activeFilter, setActiveFilter] = useState('all');
  const [highlightedPointId, setHighlightedPointId] = useState(null);
  const [copySuccess, setCopySuccess] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [toleranceMode, setToleranceMode] = useState('average'); // 'average' or 'sop_plane'
  const [localVerticalDistances, setLocalVerticalDistances] = useState(verticalDistances);

  const svgRef = useRef(null);

  useEffect(() => {
    setLocalVerticalDistances(verticalDistances);
  }, [verticalDistances]);

  const averageDistance = useMemo(() => {
    if (localVerticalDistances.length === 0) return 0;
    const sum = localVerticalDistances.reduce((total, point) => total + point.verticalDistance, 0);
    return sum / localVerticalDistances.length;
  }, [localVerticalDistances]);

  const absoluteAverage = useMemo(() => {
    if (localVerticalDistances.length === 0) return 0;
    const sum = localVerticalDistances.reduce((total, point) => total + Math.abs(point.verticalDistance), 0);
    return sum / localVerticalDistances.length;
  }, [localVerticalDistances]);

  const measuredPointsWithStatus = useMemo(() => {
    return localVerticalDistances.map(point => {
      const deviation = Math.round(point.verticalDistance);
      let isAbove, isBelow;

      if (toleranceMode === 'average') {
        isAbove = deviation > averageDistance + upperTolerance;
        isBelow = deviation < averageDistance - lowerTolerance;
      } else { // toleranceMode === 'sop_plane'
        isAbove = deviation > upperTolerance;
        isBelow = deviation < -lowerTolerance;
      }
      
      return {
        ...point,
        deviation,
        status: isAbove ? 'above' : isBelow ? 'below' : 'within'
      };
    });
  }, [localVerticalDistances, averageDistance, upperTolerance, lowerTolerance, toleranceMode]); // Añadir toleranceMode como dependencia

  const filteredMeasuredPoints = useMemo(() => {
    if (activeFilter === 'all') return measuredPointsWithStatus;
    return measuredPointsWithStatus.filter(point => point.status === activeFilter);
  }, [measuredPointsWithStatus, activeFilter]);

  const sortedFilteredPoints = useMemo(() => {
    let sortableItems = [...filteredMeasuredPoints];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (sortConfig.key === 'status') {
          const statusOrder = { 'above': 3, 'within': 2, 'below': 1 };
          const statusA = statusOrder[a.status];
          const statusB = statusOrder[b.status];
          if (statusA < statusB) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
          }
          if (statusA > statusB) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
          }
          return 0;
        }

        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        const isNumeric = !isNaN(parseFloat(aValue)) && isFinite(aValue) && !isNaN(parseFloat(bValue)) && isFinite(bValue);

        if (isNumeric) {
            if (parseFloat(aValue) < parseFloat(bValue)) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (parseFloat(aValue) > parseFloat(bValue)) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
        } else {
            if (aValue < bValue) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
        }
        
        return 0;
      });
    }
    return sortableItems;
  }, [filteredMeasuredPoints, sortConfig]);


  const pointsCount = useMemo(() => {
    return measuredPointsWithStatus.reduce((acc, point) => {
      if (point.status === 'above') acc.above++;
      if (point.status === 'below') acc.below++;
      return acc;
    }, { above: 0, below: 0 });
  }, [measuredPointsWithStatus]);

  const handleRowClick = (pointId) => {
    setHighlightedPointId(pointId);
    
    if (ref.current) {
      const chartElement = ref.current.querySelector('.overflow-auto');
      if (chartElement) {
        chartElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const handleDeletePoint = (pointIdToDelete) => {
    const newVerticalDistances = localVerticalDistances.filter(point => point.id !== pointIdToDelete);
    setLocalVerticalDistances(newVerticalDistances);

    if (highlightedPointId === pointIdToDelete) {
      setHighlightedPointId(null);
    }
  };

  const copyTableToClipboard = () => {
    const header = ['ID', 'X', 'Y', 'Z (m)', 'Dev. (mm)', 'Status'].join('\t');
    const rows = sortedFilteredPoints.map(point => {
      const statusText = point.status === 'above' ? 'Upper' : point.status === 'below' ? 'Lower' : 'Ok';
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
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    }).catch(err => {
      setCopySuccess('Error copying');
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

  useEffect(() => {
    if (highlightedPointId && svgRef.current) {
      const highlighted = [...sopCoordinates, ...measuredPointsWithStatus].find(p => p.id === highlightedPointId);
      if (highlighted) {
        const svg = svgRef.current;
        const container = svg.parentElement;

        const minX = Math.min(...[...sopCoordinates, ...measuredPointsWithStatus].map(p => p.x));
        const maxX = Math.max(...[...sopCoordinates, ...measuredPointsWithStatus].map(p => p.x));
        const minY = Math.min(...[...sopCoordinates, ...measuredPointsWithStatus].map(p => p.y));
        const maxY = Math.max(...[...sopCoordinates, ...measuredPointsWithStatus].map(p => p.y));
        
        const chartWidth = 800;
        const chartHeight = 800;
        const padding = 100;
        
        const scaleX = (chartWidth - 2 * padding) / (maxX - minX);
        const scaleY = (chartHeight - 2 * padding) / (maxY - minY);
        const scale = Math.min(scaleX, scaleY);

        const offsetX = padding - minX * scale;
        const offsetY = chartHeight - padding + minY * scale;

        const pointX_svg = offsetX + highlighted.x * scale;
        const pointY_svg = offsetY - highlighted.y * scale;

        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;

        const scrollLeft = pointX_svg - containerWidth / 2;
        const scrollTop = pointY_svg - containerHeight / 2;

        container.scrollTo({
          left: scrollLeft,
          top: scrollTop,
          behavior: 'smooth'
        });
      }
    }
  }, [highlightedPointId, sopCoordinates, measuredPointsWithStatus]);

  return (
    <div className="mt-6 space-y-4" ref={ref}>
      {/* Panel de Promedios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Average Deviation</h3>
          <p className="text-xl">{Math.round(averageDistance)} mm</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Absolute Average Deviation</h3>
          <p className="text-xl">{Math.round(absoluteAverage)} mm</p>
        </div>
      </div>

      {/* Panel de Tolerancias */}
      <div className="p-4 bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-3">Tolerance Parameters</h3>
        
        {/* Selector de Modo de Tolerancia */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Apply Tolerance Relative to:</label>
          <div className="flex gap-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="average"
                checked={toleranceMode === 'average'}
                onChange={() => setToleranceMode('average')}
                className="form-radio"
              />
              <span className="ml-2 text-sm">Average Deviation</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="sop_plane"
                checked={toleranceMode === 'sop_plane'}
                onChange={() => setToleranceMode('sop_plane')}
                className="form-radio"
              />
              <span className="ml-2 text-sm">SOP Plane</span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Upper Limit (+mm)
              {toleranceMode === 'average' && <span className="ml-2 text-xs text-gray-500">(≥ average + this value)</span>}
              {toleranceMode === 'sop_plane' && <span className="ml-2 text-xs text-gray-500">(≥ this value)</span>}
            </label>
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
            <label className="block text-sm font-medium mb-1">
              Lower Limit (-mm)
              {toleranceMode === 'average' && <span className="ml-2 text-xs text-gray-500">(≤ average - this value)</span>}
              {toleranceMode === 'sop_plane' && <span className="ml-2 text-xs text-gray-500">(≤ -this value)</span>}
            </label>
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
        <h3 className="text-lg font-semibold mb-3">Visualization Filters</h3>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setActiveFilter('all')} className={`btn-filter ${activeFilter === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}>
            👁️ All ({measuredPointsWithStatus.length})
          </button>
          <button onClick={() => setActiveFilter('within')} className={`btn-filter ${activeFilter === 'within' ? 'bg-green-600 text-white' : 'bg-green-100'}`}>
            ✅ Ok ({measuredPointsWithStatus.length - pointsCount.above - pointsCount.below})
          </button>
          <button onClick={() => setActiveFilter('above')} className={`btn-filter ${activeFilter === 'above' ? 'bg-red-600 text-white' : 'bg-red-100'}`}>
            🔴 Upper ({pointsCount.above})
          </button>
          <button onClick={() => setActiveFilter('below')} className={`btn-filter ${activeFilter === 'below' ? 'bg-blue-600 text-white' : 'bg-blue-100'}`}>
            🔵 Lower ({pointsCount.below})
          </button>
        </div>
      </div>

      {/* Gráfico */}
      <DeviationChart 
        ref={svgRef}
        sopPoints={sopCoordinates}
        measuredPoints={sortedFilteredPoints}
        average={averageDistance}
        upperTol={upperTolerance}
        lowerTol={lowerTolerance}
        highlightedPointId={highlightedPointId}
        toleranceMode={toleranceMode}
      />
      
      {/* Tabla de resultados */}
      <div className="overflow-x-auto relative">
        <div className="flex justify-between items-center mb-2">
           <h3 className="text-lg font-semibold">Deviation Results</h3>
           <button
             onClick={copyTableToClipboard}
             className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
           >
             📋 Copy to Excel
           </button>
        </div>
        {copySuccess && <p className="text-green-600 text-sm mb-2">{copySuccess}</p>}
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-2 cursor-pointer hover:bg-gray-200" onClick={() => requestSort('id')}>
                ID {sortConfig.key === 'id' ? (sortConfig.direction === 'ascending' ? ' ↑' : ' ↓') : ''}
              </th>
              <th className="px-4 py-2 cursor-pointer hover:bg-gray-200" onClick={() => requestSort('x')}>
                X {sortConfig.key === 'x' ? (sortConfig.direction === 'ascending' ? ' ↑' : ' ↓') : ''}
              </th>
              <th className="px-4 py-2 cursor-pointer hover:bg-gray-200" onClick={() => requestSort('y')}>
                Y {sortConfig.key === 'y' ? (sortConfig.direction === 'ascending' ? ' ↑' : ' ↓') : ''}
              </th>
              <th className="px-4 py-2 cursor-pointer hover:bg-gray-200" onClick={() => requestSort('z')}>
                Z (m) {sortConfig.key === 'z' ? (sortConfig.direction === 'ascending' ? ' ↑' : ' ↓') : ''}
              </th>
              <th 
                className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                onClick={() => requestSort('deviation')}
              >
                Dev. (mm) {sortConfig.key === 'deviation' ? (sortConfig.direction === 'ascending' ? ' ↑' : ' ↓') : ''}
              </th>
              <th className="px-4 py-2 cursor-pointer hover:bg-gray-200" onClick={() => requestSort('status')}>
                Status {sortConfig.key === 'status' ? (sortConfig.direction === 'ascending' ? ' ↑' : ' ↓') : ''}
              </th>
              <th className="px-4 py-2">Actions</th>
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
                }`}>
                  {point.status === 'above' ? (
                    <span className="font-medium">↑ Upper</span>
                  ) : point.status === 'below' ? (
                    <span className="font-medium">↓ Lower</span>
                  ) : (
                    <span className="font-medium">✓ Ok</span>
                  )}
                </td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePoint(point.id);
                    }}
                    className="px-2 py-1 bg-blue-300 text-blue-800 rounded hover:bg-blue-400 transition text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

export default ComparisonResults;