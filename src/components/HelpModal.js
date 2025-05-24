import React from 'react';

const HelpModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Acerca de Inclined Surface Level Analyzer</h3>
          <div className="mt-2 px-7 py-3 text-left text-sm text-gray-500 overflow-y-auto max-h-96">
            <p className="mb-4">
              Inclined Surface Level Analyzer es una herramienta diseñada para analizar las desviaciones verticales de puntos medidos topográficamente respecto a un plano de referencia definido por puntos SOP (Sistema de Origen de Proyecto).
            </p>
            
            <h4 className="font-semibold mb-2">Funcionalidades Principales:</h4>
            <ul className="list-disc list-inside mb-4 space-y-1">
              <li><strong>Ingreso de Datos:</strong> Pega directamente las coordenadas SOP y las mediciones topográficas desde Excel. El programa acepta IDs numéricos o textuales.</li>
              <li><strong>Cálculo de Plano:</strong> Define un plano de referencia 3D utilizando al menos 3 puntos SOP.</li>
              <li><strong>Análisis de Desviaciones:</strong> Calcula la distancia vertical (en milímetros) de cada punto medido al plano SOP.</li>
              <li><strong>Visualización en Tabla:</strong> Muestra un listado detallado de los puntos medidos, sus coordenadas y la desviación calculada.</li>
              <li><strong>Promedios:</strong> Calcula la desviación promedio y la desviación absoluta promedio.</li>
              <li><strong>Controles de Tolerancia:</strong> Ajusta límites superiores e inferiores de desviación para identificar puntos fuera de tolerancia.</li>
              <li><strong>Filtros:</strong> Filtra los puntos visibles en la tabla y el gráfico según su estado de desviación (Dentro, Superior, Inferior, Todos).</li>
              <li><strong>Visualización Gráfica:</strong> Muestra un mapa 2D (X, Y) con los puntos SOP y los puntos medidos, coloreados según su estado de desviación. Los puntos SOP siempre se muestran en la capa superior.</li>
              <li><strong>Interacción Gráfico-Tabla:</strong> Clica en una fila de la tabla para resaltar el punto correspondiente en el gráfico. El punto resaltado se muestra en una capa superior (inferior a los SOP).</li>
              <li><strong>Etiqueta al Clicar en Gráfico:</strong> Clica en un punto en el gráfico (SOP o medido) para mostrar una etiqueta persistente junto a él con su ID y coordenadas (X, Y, Z). Esta etiqueta aparece en una capa superior y en formato multilínea.</li>
              <li><strong>Ordenamiento:</strong> Ordena la tabla de resultados por la columna de desviación.</li>
              <li><strong>Exportación:</strong> Copia los datos de la tabla (respetando filtros y orden) para pegarlos en Excel.</li>
              <li><strong>Simulación:</strong> Carga un conjunto de datos de ejemplo para probar la aplicación rápidamente.</li>
              <li><strong>Reset:</strong> Borra los datos SOP, las mediciones o ambos para empezar de nuevo.</li>
            </ul>

            <h4 className="font-semibold mb-2">Cómo Usar:</h4>
            <ol className="list-decimal list-inside space-y-1">
              <li>Pega las coordenadas SOP en el primer cuadro de texto y haz clic en "Procesar Coordenadas". Asegúrate de tener al menos 3 puntos para calcular el plano.</li>
              <li>Pega las mediciones topográficas en el segundo cuadro de texto y haz clic en "Procesar Mediciones".</li>
              <li>Explora la tabla y el gráfico para analizar las desviaciones.</li>
              <li>Utiliza los controles de tolerancia y filtros para refinar tu análisis.</li>
              <li>Clica en filas de la tabla o puntos del gráfico para interacciones adicionales.</li>
              <li>Usa el botón "Copiar para Excel" para exportar tus resultados.</li>
              <li>Utiliza los botones de Reset o Simulación según necesites.</li>
            </ol>
          </div>

          <div className="items-center px-4 py-3">
            <button
              id="ok-btn"
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Entendido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;

// DONE