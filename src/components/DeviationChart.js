import React, { useState } from 'react';

const DeviationChart = ({ sopPoints, measuredPoints, average, upperTol, lowerTol, highlightedPointId }) => {
  const [clickedPointInfo, setClickedPointInfo] = useState(null);

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
    if (deviation > average + upperTol) return 'above';
    if (deviation < average - lowerTol) return 'below';
    return 'within';
  };

  const handleClick = (point) => {
    // Si el punto clicado es el mismo que ya está clicado, lo deseleccionamos
    if (clickedPointInfo && clickedPointInfo.id === point.id) {
      setClickedPointInfo(null);
    } else {
      setClickedPointInfo({
        id: point.id,
        x: point.x,
        y: point.y,
        z: point.z,
        deviation: point.deviation, // Solo para puntos medidos
        status: point.status, // Solo para puntos medidos
        isSop: point.isSop, // Indicador si es SOP
      });
    }
  };

  // Separamos el punto resaltado del resto de puntos medidos
  const highlightedPoint = measuredPoints.find(p => p.id === highlightedPointId);
  const otherMeasuredPoints = measuredPoints.filter(p => p.id !== highlightedPointId);

  return (
    <div className="mt-6 p-4 bg-white rounded-lg shadow relative">
      <h3 className="text-lg font-semibold mb-4 text-center">Mapa de Desviaciones y Puntos SOP</h3>
      <div className="overflow-auto">
        <svg width={chartWidth} height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="border border-gray-200 rounded-lg">
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
                    highlightedPoint.status === 'above' ? '#ef4444' :
                    highlightedPoint.status === 'below' ? '#3b82f6' : '#10b981'
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

          {/* Puntos SOP (renderizados al final para estar en la capa superior) */}
          {sopPoints.map((point) => {
            const x = offsetX + point.x * scale;
            const y = offsetY - point.y * scale;
            
            return (
              <g 
                key={`sop-${point.id}`}
                onClick={() => handleClick(point)}
                style={{ cursor: 'pointer' }}
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
          
          {/* Etiqueta de Punto Clicado (renderizada en capa superior) */}
          {clickedPointInfo && (
            <g transform={`translate(${offsetX + clickedPointInfo.x * scale + 20}, ${offsetY - clickedPointInfo.y * scale - 20})`}>
              <rect x="-5" y="-5" width="150" height={clickedPointInfo.isSop ? "65" : "85"} fill="rgba(255, 255, 255, 0.9)" stroke="#333" strokeWidth="1" rx="5" ry="5" /> {/* Aumentar alto */}
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
        <h3 className="text-lg font-semibold mb-3">Leyenda</h3>
        <div className="flex flex-wrap justify-center gap-6">
          <div className="flex items-center">
            <span className="inline-block w-4 h-4 rounded-full bg-[#ffc107] mr-2 border border-white"></span>
            <span>Punto SOP</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-4 h-4 rounded-full bg-[#ef4444] mr-2 border border-white"></span>
            <span>Medido: Superior (+{upperTol}mm)</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-4 h-4 rounded-full bg-[#10b981] mr-2 border border-white"></span>
            <span>Medido: Dentro de tolerancia</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-4 h-4 rounded-full bg-[#3b82f6] mr-2 border border-white"></span>
            <span>Medido: Inferior (-{lowerTol}mm)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviationChart;

// DONE