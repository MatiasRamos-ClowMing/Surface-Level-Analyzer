import React, { useState, useRef, useEffect, forwardRef } from 'react';

const DeviationChart = forwardRef(({ sopPoints, measuredPoints, average, upperTol, lowerTol, highlightedPointId, toleranceMode }, ref) => {
  const [clickedPointInfo, setClickedPointInfo] = useState(null);
  const [drawingMode, setDrawingMode] = useState(false);
  const [drawnPolylines, setDrawnPolylines] = useState([]);
  const [currentPolyline, setCurrentPolyline] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const svgRef = useRef(null);

  // Estados para el zoom y pan
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, width: 800, height: 800 });
  const [viewBoxHistory, setViewBoxHistory] = useState([{ x: 0, y: 0, width: 800, height: 800 }]); // Historial para zoom previo
  const [historyIndex, setHistoryIndex] = useState(0); // Índice del historial
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });

  // Combinamos ambos conjuntos de puntos para calcular los límites
  const allPoints = [...sopPoints, ...measuredPoints];

  // Normalizamos las coordenadas para el gráfico
  const minX = Math.min(...allPoints.map(p => p.x));
  const maxX = Math.max(...allPoints.map(p => p.x));
  const minY = Math.min(...allPoints.map(p => p.y));
  const maxY = Math.max(...allPoints.map(p => p.y));
  
  const chartWidth = 800; // Ancho del SVG
  const chartHeight = 800; // Alto del SVG
  const padding = 100; // Espacio alrededor del gráfico
  
  const scaleX = (chartWidth - 2 * padding) / (maxX - minX);
  const scaleY = (chartHeight - 2 * padding) / (maxY - minY);
  const scale = Math.min(scaleX, scaleY);

  const offsetX = padding - minX * scale;
  const offsetY = chartHeight - padding + minY * scale;

  const getPointStatus = (deviation) => {
    // Lógica de tolerancia solo respecto al promedio
    if (deviation > average + upperTol) return 'above';
    if (deviation < average - lowerTol) return 'below';
    return 'within';
  };

  const handleClick = (point) => {
    if (clickedPointInfo && clickedPointInfo.id === point.id) {
      setClickedPointInfo(null);
    } else {
      setClickedPointInfo({
        id: point.id,
        x: point.x,
        y: point.y,
        z: point.z,
        deviation: point.deviation,
        status: getPointStatus(point.verticalDistance),
        isSop: point.isSop,
      });
    }

    if (drawingMode && point.isSop) {
      if (currentPolyline.length === 0) {
        setCurrentPolyline([point]);
      } else {
        setCurrentPolyline([...currentPolyline, point]);
      }
    } else if (drawingMode && !point.isSop) {
      if (currentPolyline.length > 1) {
        setDrawnPolylines([...drawnPolylines, currentPolyline]);
      }
      setCurrentPolyline([]);
    }
  };

  const handleMouseMove = (event) => {
    if (svgRef.current) {
      const svg = svgRef.current;
      const point = svg.createSVGPoint();
      point.x = event.clientX;
      point.y = event.clientY;
      const svgPoint = point.matrixTransform(svg.getScreenCTM().inverse());
      setMousePosition({ x: svgPoint.x, y: svgPoint.y });

      // Lógica de pan
      if (isPanning) {
        const dx = svgPoint.x - startPan.x;
        const dy = svgPoint.y - startPan.y;
        setViewBox(prevViewBox => ({
          x: prevViewBox.x - dx,
          y: prevViewBox.y - dy,
          width: prevViewBox.width,
          height: prevViewBox.height,
        }));
        setStartPan({ x: svgPoint.x, y: svgPoint.y });
      }
    }
  };

  const handleMouseDown = (event) => {
    if (event.button === 0 && svgRef.current) { // Botón izquierdo del mouse
      const svg = svgRef.current;
      const point = svg.createSVGPoint();
      point.x = event.clientX;
      point.y = event.clientY;
      const svgPoint = point.matrixTransform(svg.getScreenCTM().inverse());
      setIsPanning(true);
      setStartPan({ x: svgPoint.x, y: svgPoint.y });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleWheel = (event) => {
    if (!svgRef.current) return;

    event.preventDefault(); // Prevenir scroll de la página

    const svg = svgRef.current;
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const svgPoint = point.matrixTransform(svg.getScreenCTM().inverse());

    const zoomFactor = 1.1; // Factor de zoom
    const newViewBox = { ...viewBox };

    if (event.deltaY < 0) { // Zoom in
      newViewBox.width /= zoomFactor;
      newViewBox.height /= zoomFactor;
      newViewBox.x += (svgPoint.x - newViewBox.x) * (1 - 1 / zoomFactor);
      newViewBox.y += (svgPoint.y - newViewBox.y) * (1 - 1 / zoomFactor);
    } else { // Zoom out
      newViewBox.width *= zoomFactor;
      newViewBox.height *= zoomFactor;
      newViewBox.x += (svgPoint.x - newViewBox.x) * (1 - zoomFactor);
      newViewBox.y += (svgPoint.y - newViewBox.y) * (1 - zoomFactor);
    }

    setViewBox(newViewBox);
    // Añadir al historial de zoom
    setViewBoxHistory(prevHistory => [...prevHistory.slice(0, historyIndex + 1), newViewBox]);
    setHistoryIndex(prevIndex => prevIndex + 1);
  };

  const zoomIn = () => {
    const zoomFactor = 1.2;
    const newViewBox = {
      width: viewBox.width / zoomFactor,
      height: viewBox.height / zoomFactor,
      x: viewBox.x + (viewBox.width - viewBox.width / zoomFactor) / 2,
      y: viewBox.y + (viewBox.height - viewBox.height / zoomFactor) / 2,
    };
    setViewBox(newViewBox);
    setViewBoxHistory(prevHistory => [...prevHistory.slice(0, historyIndex + 1), newViewBox]);
    setHistoryIndex(prevIndex => prevIndex + 1);
  };

  const zoomOut = () => {
    const zoomFactor = 1.2;
    const newViewBox = {
      width: viewBox.width * zoomFactor,
      height: viewBox.height * zoomFactor,
      x: viewBox.x - (viewBox.width * zoomFactor - viewBox.width) / 2,
      y: viewBox.y - (viewBox.height * zoomFactor - viewBox.height) / 2,
    };
    setViewBox(newViewBox);
    setViewBoxHistory(prevHistory => [...prevHistory.slice(0, historyIndex + 1), newViewBox]);
    setHistoryIndex(prevIndex => prevIndex + 1);
  };

  const zoomPrevious = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prevIndex => prevIndex - 1);
      setViewBox(viewBoxHistory[historyIndex - 1]);
    }
  };

  const toggleDrawingMode = () => {
    setDrawingMode(!drawingMode);
    if (currentPolyline.length > 1) {
       setDrawnPolylines([...drawnPolylines, currentPolyline]);
    }
    setCurrentPolyline([]);
  };

  const clearLines = () => {
    setDrawnPolylines([]);
    setCurrentPolyline([]);
  };

  const drawAutomaticPolyline = () => {
    if (sopPoints.length > 1) {
      setDrawnPolylines([...drawnPolylines, [...sopPoints, sopPoints[0]]]);
      setCurrentPolyline([]);
      setDrawingMode(false);
    }
  };

  useEffect(() => {
    if (highlightedPointId && svgRef.current && ref.current) {
      const highlighted = [...sopPoints, ...measuredPoints].find(p => p.id === highlightedPointId);
      if (highlighted) {
        const svg = svgRef.current;
        const container = ref.current.querySelector('.overflow-auto');

        const minX = Math.min(...[...sopPoints, ...measuredPoints].map(p => p.x));
        const maxX = Math.max(...[...sopPoints, ...measuredPoints].map(p => p.x));
        const minY = Math.min(...[...sopPoints, ...measuredPoints].map(p => p.y));
        const maxY = Math.max(...[...sopPoints, ...measuredPoints].map(p => p.y));
        
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
  }, [highlightedPointId, sopPoints, measuredPoints, ref]);

  // Separamos el punto resaltado del resto de puntos medidos
  const highlightedPoint = measuredPoints.find(p => p.id === highlightedPointId);
  const otherMeasuredPoints = measuredPoints.filter(p => p.id !== highlightedPointId);

  return (
    <div className="mt-6 p-4 bg-white rounded-lg shadow relative" ref={ref}>
      <h3 className="text-lg font-semibold mb-4 text-center">Deviation Map and SOP Points</h3>
      
      {/* Controles de Dibujo y Zoom */}
      <div className="mb-4 flex flex-wrap gap-2 justify-center">
        <button
          onClick={toggleDrawingMode}
          className={`px-3 py-1 rounded ${drawingMode ? 'bg-yellow-600 text-white' : 'bg-gray-200'}`}
        >
          {drawingMode ? 'Deactivate Drawing' : 'Activate SOP Drawing'}
        </button>
        <button
          onClick={clearLines}
          disabled={drawnPolylines.length === 0 && currentPolyline.length === 0}
          className={`px-3 py-1 rounded ${drawnPolylines.length === 0 && currentPolyline.length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600 text-white'}`}
        >
          Clear Drawings
        </button>
        <button
          onClick={drawAutomaticPolyline}
          disabled={sopPoints.length < 2}
          className={`px-3 py-1 rounded ${sopPoints.length < 2 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
        >
          Automatic SOP Drawing
        </button>
        <button onClick={zoomIn} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition">
          Zoom In
        </button>
        <button onClick={zoomOut} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition">
          Zoom Out
        </button>
        <button onClick={zoomPrevious} disabled={historyIndex === 0} className={`px-3 py-1 rounded ${historyIndex === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300 transition'}`}>
          Zoom Previous
        </button>
      </div>

      <div className="overflow-auto">
        <svg 
          ref={svgRef}
          width={chartWidth} 
          height={chartHeight} 
          viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`} 
          className="border border-gray-200 rounded-lg"
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          style={{ cursor: drawingMode ? 'crosshair' : (isPanning ? 'grabbing' : 'grab') }}
        >
          {/* Ejes */}
          <line x1={padding} y1="40" x2={padding} y2={chartHeight - 40} stroke="#ccc" strokeWidth="2" />
          <line x1="40" y1={chartHeight - padding} x2={chartWidth - 40} y2={chartHeight - padding} stroke="#ccc" strokeWidth="2" />
          
          {/* Etiquetas ejes */}
          <text x={padding - 10} y="30" textAnchor="end" fontSize="12" fill="#666">Y</text>
          <text x={chartWidth - 30} y={chartHeight - padding + 15} textAnchor="end" fontSize="12" fill="#666">X</text>
          
          {/* Otros Puntos Medidos (renderizados primero) */}
          {otherMeasuredPoints.map((point) => {
            const x = offsetX + point.x * scale;
            const y = offsetY - point.y * scale;
            const status = getPointStatus(point.verticalDistance);
            const radius = 8 + Math.min(6, Math.abs(point.deviation) / 5);
            
            return (
              <g 
                key={`measured-${point.id}`}
                onClick={() => handleClick(point)}
                style={{ cursor: 'pointer' }}
              >
                <circle
                  cx={x}
                  cy={y}
                  r={radius}
                  fill={
                    status === 'above' ? '#ef4444' :
                    status === 'below' ? '#3b82f6' : '#10b981'
                  }
                  stroke="#fff"
                  strokeWidth={2}
                />
                <text
                  x={x}
                  y={y + 4}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#fff"
                  fontWeight="bold"
                >
                  {Math.abs(point.deviation)}
                </text>
              </g>
            );
          })}

          {/* Punto Medido Resaltado (renderizado después de otros medidos) */}
          {highlightedPoint && (
             <g 
                key={`measured-${highlightedPoint.id}`}
                onClick={() => handleClick(highlightedPoint)}
                style={{ cursor: 'pointer' }}
              >
                <circle
                  cx={offsetX + highlightedPoint.x * scale}
                  cy={offsetY - highlightedPoint.y * scale}
                  r={8 + Math.min(6, Math.abs(highlightedPoint.deviation) / 5) + 5}
                  fill={
                    getPointStatus(highlightedPoint.verticalDistance) === 'above' ? '#ef4444' :
                    getPointStatus(highlightedPoint.verticalDistance) === 'below' ? '#3b82f6' : '#10b981'
                  }
                  stroke="#000"
                  strokeWidth={3}
                >
                   <animate attributeName="r" from={8 + Math.min(6, Math.abs(highlightedPoint.deviation) / 5)} to={8 + Math.min(6, Math.abs(highlightedPoint.deviation) / 5) + 5} dur="1s" begin="0s" repeatCount="indefinite" />
                </circle>
                <text
                  x={offsetX + highlightedPoint.x * scale}
                  y={offsetY - highlightedPoint.y * scale + 4}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#fff"
                  fontWeight="bold"
                >
                  {Math.abs(highlightedPoint.deviation)}
                </text>
              </g>
          )}

          {/* Polilíneas Dibujadas (renderizadas después de puntos medidos) */}
          {drawnPolylines.map((polyline, polyIndex) => (
            <polyline
              key={`polyline-${polyIndex}`}
              points={polyline.map(p => `${offsetX + p.x * scale},${offsetY - p.y * scale}`).join(' ')}
              fill="none"
              stroke="#000"
              strokeWidth="2"
            />
          ))}

          {/* Polilínea Actual (siguiendo el mouse, renderizada después de polilíneas dibujadas) */}
          {currentPolyline.length > 0 && (
             <polyline
              points={
                currentPolyline.map(p => `${offsetX + p.x * scale},${offsetY - p.y * scale}`).join(' ') +
                ` ${mousePosition.x},${mousePosition.y}`
              }
              fill="none"
              stroke="#000"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          )}


          {/* Puntos SOP (renderizados al final para estar en la capa más superior) */}
          {sopPoints.map((point) => {
            const x = offsetX + point.x * scale;
            const y = offsetY - point.y * scale; // Corregido aquí
            
            return (
              <g 
                key={`sop-${point.id}`}
                onClick={() => handleClick({...point, isSop: true})}
                style={{ cursor: drawingMode ? 'crosshair' : (isPanning ? 'grabbing' : 'grab') }}
              >
                <circle
                  cx={x}
                  cy={y}
                  r={10}
                  fill="#ffc107"
                  stroke="#fff"
                  strokeWidth="2"
                />
                 <text
                  x={x}
                  y={y - 15}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#333"
                  fontWeight="bold"
                >
                  Z: {point.z.toFixed(3)}
                </text>
                 <text
                  x={x}
                  y={y + 4}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#333"
                  fontWeight="bold"
                >
                  {point.id}
                </text>
              </g>
            );
          })}
          
          {/* Etiqueta de Punto Clicado (renderizada en la capa más superior) */}
          {clickedPointInfo && (
            <g transform={`translate(${offsetX + clickedPointInfo.x * scale + 20}, ${offsetY - clickedPointInfo.y * scale - 20})`}>
              <rect x="-5" y="-5" width="150" height={clickedPointInfo.isSop ? "65" : "85"} fill="rgba(255, 255, 255, 0.9)" stroke="#333" strokeWidth="1" rx="5" ry="5" />
              <text x="0" y="15" fontSize="12" fill="#333" fontWeight="bold">ID: {clickedPointInfo.id}</text>
              <text x="0" y="30" fontSize="12" fill="#333">X: {clickedPointInfo.x.toFixed(3)}</text>
              <text x="0" y="45" fontSize="12" fill="#333">Y: {clickedPointInfo.y.toFixed(3)}</text>
              <text x="0" y="60" fontSize="12" fill="#333">Z: {clickedPointInfo.z.toFixed(3)}</text>
              {!clickedPointInfo.isSop && (
                <>
                  <text x="0" y="75" fontSize="12" fill="#333">Desv: {clickedPointInfo.deviation} mm</text>
                </>
              )}
            </g>
          )}

          {/* La leyenda ya no está dentro del SVG */}
        </svg>
      </div>

      {/* Leyenda fuera del SVG */}
      <div className="mt-4 p-4 bg-white rounded-lg shadow text-center">
        <h3 className="text-lg font-semibold mb-3">Legend</h3>
        <div className="flex flex-wrap justify-center gap-6">
          <div className="flex items-center">
            <span className="inline-block w-4 h-4 rounded-full bg-[#ffc107] mr-2 border border-white"></span>
            <span>SOP Point</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-4 h-4 rounded-full bg-[#ef4444] mr-2 border border-white"></span>
            <span>Measured: Upper (+{upperTol}mm)</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-4 h-4 rounded-full bg-[#10b981] mr-2 border border-white"></span>
            <span>Measured: Within Tolerance</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-4 h-4 rounded-full bg-[#3b82f6] mr-2 border border-white"></span>
            <span>Measured: Lower (-{lowerTol}mm)</span>
          </div>
        </div>
      </div>
    </div>
  );
});

export default DeviationChart;

// DONE