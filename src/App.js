import { useState, useRef } from 'react';
import { CoordinateParser } from './components/CoordinateParser';
import { CoordinatesTable } from './components/CoordinatesTable';
import { calculatePlaneEquation } from './utils/planeCalculator';
import { PlaneEquationDisplay } from './components/PlaneEquationDisplay';
import { MeasurementParser } from './components/MeasurementParser';
import { compareVerticalDistances } from './utils/comparison';
import ComparisonResults from './components/ComparisonResults';
import HelpModal from './components/HelpModal';

export default function App() {
  const [sopCoordinates, setSopCoordinates] = useState([]);
  const [measuredCoordinates, setMeasuredCoordinates] = useState([]);
  const [planeEquation, setPlaneEquation] = useState(null);
  const [verticalDistances, setVerticalDistances] = useState(null);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  const comparisonResultsRef = useRef(null);
  const sopParserRef = useRef(null);
  const measurementParserRef = useRef(null);

  const handleSopParse = (parsedCoordinates) => {
    setSopCoordinates(parsedCoordinates);
    if (parsedCoordinates.length >= 3) {
      setPlaneEquation(calculatePlaneEquation(parsedCoordinates));
    } else {
      setPlaneEquation(null);
    }
    setVerticalDistances(null);
  };

  const handleMeasurementParse = (parsedCoordinates) => {
    setMeasuredCoordinates(parsedCoordinates);
    if (planeEquation) {
      setVerticalDistances(compareVerticalDistances(parsedCoordinates, planeEquation));
    } else if (sopCoordinates.length >= 3) {
       const newPlane = calculatePlaneEquation(sopCoordinates);
       setPlaneEquation(newPlane);
       setVerticalDistances(compareVerticalDistances(parsedMeasured, newPlane));
    } else {
       setVerticalDistances(null);
    }
  };

  const resetSopData = () => {
    setSopCoordinates([]);
    setPlaneEquation(null);
    setVerticalDistances(null);
    if (sopParserRef.current) {
      sopParserRef.current.clearText();
    }
  };

  const resetMeasurementData = () => {
    setMeasuredCoordinates([]);
    setVerticalDistances(null);
    if (measurementParserRef.current) {
      measurementParserRef.current.clearText();
    }
  };

  const resetAllData = () => {
    resetSopData();
    resetMeasurementData();
  };

  const loadSimulationData = () => {
    const sopData = `SOP-01	2131.920	6025.430	8.137
SOP-02	2135.920	6025.430	8.217
SOP-03	2138.750	6022.600	8.274
SOP-04	2138.750	6018.600	8.274
SOP-05	2135.920	6015.770	8.217
SOP-06	2131.920	6015.770	8.137
SOP-07	2129.090	6018.600	8.080
SOP-08	2129.090	6022.600	8.080`;

    const measuredData = `P1	2138.646	6020.499	8.271
P2	2133.983	6020.486	8.177
P3	2131.476	6024.861	8.127
P4	2132.017	6024.766	8.136
P5	2132.607	6024.743	8.147
P6	2132.605	6025.394	8.141
P7	2131.955	6025.408	8.134
P8	2133.044	6025.393	8.152
P9	2133.123	6024.807	8.159
P10	2133.135	6024.032	8.155
P11	2133.248	6023.081	8.158
P12	2133.331	6022.034	8.164
P13	2133.150	6020.483	8.161
P14	2133.449	6020.914	8.168
P15	2134.024	6020.907	8.174
P16	2133.894	6021.801	8.166
P17	2133.941	6022.809	8.169
P18	2134.001	6023.508	8.173
P19	2134.031	6024.449	8.180
P20	2134.259	6025.370	8.179
P21	2134.741	6025.386	8.194
P22	2134.726	6024.478	8.188
P23	2134.839	6023.526	8.186
P24	2132.757	6020.492	8.149
P25	2134.887	6022.284	8.194
P26	2134.981	6021.239	8.192
P27	2135.030	6020.704	8.201
P28	2135.494	6020.813	8.208
P29	2135.478	6021.523	8.203
P30	2135.478	6022.329	8.205
P31	2135.512	6022.971	8.210
P32	2135.528	6023.778	8.202
P33	2135.594	6024.450	8.207
P34	2135.590	6024.969	8.208
P35	2132.758	6019.882	8.159
P36	2135.637	6025.355	8.209
P37	2136.009	6025.288	8.217
P38	2136.083	6024.584	8.215
P39	2136.220	6023.937	8.215
P40	2136.417	6022.995	8.222
P41	2136.578	6022.004	8.219
P42	2136.654	6021.455	8.227
P43	2136.809	6020.968	8.237
P44	2137.389	6020.972	8.246
P45	2137.307	6021.606	8.239
P46	2133.366	6019.829	8.163
P47	2137.336	6022.381	8.246
P48	2137.371	6022.990	8.240
P49	2137.318	6023.499	8.246
P50	2137.356	6023.928	8.246
P51	2137.772	6023.522	8.256
P52	2137.702	6023.156	8.255
P53	2137.686	6022.825	8.250
P54	2137.764	6021.979	8.253
P55	2137.830	6021.429	8.258
P56	2138.001	6020.703	8.258
P57	2134.003	6019.849	8.172
P58	2138.607	6020.702	8.270
P59	2138.665	6021.327	8.272
P60	2138.664	6021.933	8.273
P61	2138.671	6022.567	8.270
P62	2138.340	6022.949	8.266
P63	2131.499	6016.872	8.126
P64	2131.467	6016.368	8.127
P65	2130.975	6016.828	8.112
P66	2130.968	6017.503	8.114
P67	2131.041	6018.024	8.115
P68	2134.741	6019.820	8.185
P69	2131.723	6018.008	8.125
P70	2131.777	6017.365	8.125
P71	2131.821	6016.729	8.135
P72	2130.734	6018.036	8.113
P73	2130.653	6017.677	8.111
P74	2130.261	6017.503	8.109
P75	2130.323	6018.005	8.099
P76	2130.027	6017.993	8.097
P77	2129.654	6018.426	8.090
P78	2129.193	6018.798	8.077
P79	2135.457	6019.815	8.199
P80	2129.274	6019.364	8.081
P81	2129.908	6019.381	8.086
P82	2129.819	6018.747	8.093
P83	2130.498	6018.608	8.104
P84	2130.621	6019.127	8.104
P85	2131.309	6019.150	8.116
P86	2131.253	6018.556	8.125
P87	2131.824	6018.600	8.132
P88	2131.862	6019.491	8.129
P89	2131.803	6018.953	8.127
P90	2136.054	6019.823	8.214
P91	2131.449	6019.724	8.120
P92	2131.596	6020.325	8.127
P93	2131.298	6020.446	8.124
P94	2132.469	6022.904	8.143
P95	2131.704	6022.899	8.126
P96	2130.766	6022.836	8.107
P97	2130.098	6022.834	8.099
P98	2129.464	6022.768	8.092
P99	2129.239	6022.287	8.084
P100	2130.459	6022.429	8.100
P101	2136.859	6019.843	8.225
P102	2129.922	6022.297	8.095
P103	2130.733	6022.283	8.107
P104	2131.378	6022.175	8.114
P105	2132.414	6022.044	8.144
P106	2132.410	6021.610	8.145
P107	2131.714	6021.627	8.129
P108	2130.937	6021.741	8.105
P109	2130.258	6021.654	8.095
P110	2130.620	6021.615	8.083
P111	2129.202	6021.568	8.084
P112	2138.154	6020.505	8.259
P113	2137.672	6019.819	8.253
P114	2129.199	6020.806	8.080
P115	2129.183	6020.431	8.087
P116	2129.214	6019.820	8.084
P117	2129.260	6019.298	8.079
P118	2129.173	6019.057	8.077
P119	2129.596	6019.383	8.082
P120	2130.029	6019.741	8.092
P121	2130.429	6019.518	8.099
P122	2130.298	6018.851	8.096
P123	2130.284	6018.288	8.099
P124	2138.680	6019.935	8.270
P125	2131.342	6019.664	8.115
P126	2131.346	6020.108	8.116
P127	2131.186	6020.453	8.120
P128	2131.056	6020.775	8.121
P129	2130.716	6021.054	8.113
P130	2130.154	6020.881	8.094
P131	2129.948	6020.483	8.096
P132	2129.662	6020.198	8.089
P133	2129.162	6020.222	8.083
P134	2138.698	6019.305	8.263
P135	2137.926	6019.236	8.249
P136	2137.117	6019.254	8.239
P137	2136.169	6019.245	8.211
P138	2135.299	6019.222	8.202
P139	2134.514	6019.183	8.186
P140	2133.668	6019.153	8.166
P141	2132.773	6019.188	8.147
P142	2137.518	6020.503	8.246
P143	2132.803	6018.491	8.152
P144	2133.544	6018.437	8.158
P145	2134.190	6018.409	8.183
P146	2134.890	6018.380	8.200
P147	2135.702	6018.363	8.204
P148	2136.656	6018.387	8.231
P149	2137.356	6018.424	8.246
P150	2137.906	6018.415	8.254
P151	2138.418	6018.445	8.268
P152	2137.996	6017.929	8.255
P153	2137.031	6020.491	8.238
P154	2137.075	6017.943	8.237
P155	2136.200	6017.912	8.216
P156	2135.393	6017.913	8.206
P157	2134.474	6017.888	8.179
P158	2133.569	6017.914	8.164
P159	2132.814	6017.917	8.149
P160	2132.824	6017.340	8.153
P161	2133.640	6017.312	8.166
P162	2134.327	6017.237	8.180
P163	2135.076	6017.182	8.192
P164	2137.129	6020.403	8.236
P165	2135.882	6017.179	8.217
P166	2136.759	6017.224	8.233
P167	2136.715	6016.663	8.227
P168	2135.773	6016.558	8.212
P169	2135.030	6016.600	8.197
P170	2134.003	6016.604	8.175
P171	2133.345	6016.640	8.158
P172	2132.810	6016.641	8.155
P173	2132.813	6016.028	8.155
P174	2133.459	6015.944	8.162
P175	2136.409	6020.507	8.225
P176	2134.158	6015.955	8.172
P177	2134.690	6015.953	8.182
P178	2135.098	6015.890	8.192
P179	2135.903	6015.858	8.213
P180	2132.541	6015.929	8.146
P181	2132.027	6015.868	8.133
P182	2131.979	6016.529	8.139
P183	2132.444	6016.576	8.145
P184	2131.907	6017.100	8.135
P185	2132.524	6017.181	8.146
P186	2135.880	6020.526	8.212
P187	2132.058	6017.692	8.134
P188	2132.568	6017.724	8.141
P189	2131.910	6018.395	8.136
P190	2132.584	6018.391	8.146
P191	2131.961	6018.990	8.136
P192	2132.614	6019.028	8.150
P193	2131.911	6019.635	8.131
P194	2132.583	6019.638	8.152
P195	2131.981	6020.263	8.137
P196	2132.059	6020.247	8.139
P197	2135.323	6020.488	8.204
P198	2132.568	6020.319	8.145
P199	2132.542	6021.023	8.151
P200	2131.901	6021.070	8.135
P201	2132.598	6021.826	8.146
P202	2131.861	6022.058	8.126
P203	2131.922	6022.529	8.136
P204	2132.550	6022.456	8.147
P205	2132.570	6023.280	8.146
P206	2131.993	6023.386	8.134
P207	2131.359	6023.294	8.122
P208	2134.694	6020.495	8.187
P209	2130.692	6023.251	8.114
P210	2129.818	6023.217	8.089
P211	2130.285	6023.672	8.104
P212	2130.992	6023.681	8.111
P213	2131.834	6023.810	8.133
P214	2132.572	6023.944	8.147
P215	2132.561	6024.580	8.153
P216	2131.921	6024.613	8.138
P217	2131.591	6024.616	8.127
P218	2131.355	6024.415	8.125`;

    // Parsear y establecer datos SOP
    const sopLines = sopData.split('\n').filter(line => line.trim() !== '');
    const parsedSop = sopLines.map(line => {
      const parts = line.trim().split(/\s+/).filter(part => part !== '');
      return {
        id: parts[0],
        x: parseFloat(parts[1]),
        y: parseFloat(parts[2]),
        z: parseFloat(parts[3])
      };
    });
    setSopCoordinates(parsedSop);
    if (sopParserRef.current) {
      sopParserRef.current.setText(sopData);
    }

    // Parsear y establecer datos de mediciones
    const measuredLines = measuredData.split('\n').filter(line => line.trim() !== '');
    const parsedMeasured = measuredLines.map(line => {
      const parts = line.trim().split(/\s+/).filter(part => part !== '');
      return {
        id: parts[0],
        x: parseFloat(parts[1]),
        y: parseFloat(parts[2]),
        z: parseFloat(parts[3])
      };
    });
    setMeasuredCoordinates(parsedMeasured);
    if (measurementParserRef.current) {
      measurementParserRef.current.setText(measuredData);
    }

    // Recalcular plano y desviaciones si hay suficientes puntos SOP
    if (parsedSop.length >= 3) {
      const newPlane = calculatePlaneEquation(parsedSop);
      setPlaneEquation(newPlane);
      setVerticalDistances(compareVerticalDistances(parsedMeasured, newPlane));
    } else {
      setPlaneEquation(null);
      setVerticalDistances(null);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Inclined Surface Level Analyzer</h1>
      <p className="text-sm text-gray-600 mb-4">Designed and created by Felipe Manrique</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={resetSopData}
          disabled={sopCoordinates.length === 0}
          className={`px-3 py-1 rounded ${sopCoordinates.length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
        >
          Reset SOP
        </button>
        <button
          onClick={resetMeasurementData}
          disabled={measuredCoordinates.length === 0}
          className={`px-3 py-1 rounded ${measuredCoordinates.length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
        >
          Reset Survey
        </button>
        <button
          onClick={resetAllData}
          disabled={sopCoordinates.length === 0 && measuredCoordinates.length === 0}
          className={`px-3 py-1 rounded ${sopCoordinates.length === 0 && measuredCoordinates.length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
        >
          Reset All
        </button>
        <button
          onClick={loadSimulationData}
          className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
        >
          Load Simulation
        </button>
        <button
          onClick={() => window.print()}
          className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
        >
          Print
        </button>
        <button
          onClick={() => setIsHelpModalOpen(true)}
          className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
        >
          Help
        </button>
      </div>

      <CoordinateParser ref={sopParserRef} onParse={handleSopParse} />
      
      {sopCoordinates.length > 0 && (
        <CoordinatesTable data={sopCoordinates} />
      )}

      {planeEquation && sopCoordinates.length >= 3 && (
        <PlaneEquationDisplay equation={planeEquation} />
      )}

      <MeasurementParser ref={measurementParserRef} onParse={handleMeasurementParse} />

      {verticalDistances && verticalDistances.length > 0 && (
        <ComparisonResults 
          ref={comparisonResultsRef}
          sopCoordinates={sopCoordinates}
          verticalDistances={verticalDistances} 
        />
      )}

      {measuredCoordinates.length > 0 && !verticalDistances && planeEquation && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
          Calculating vertical deviations...
        </div>
      )}

      {measuredCoordinates.length > 0 && !planeEquation && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
          You need to define at least 3 SOP points first to calculate the reference plane.
        </div>
      )}

      {/* Renderizar el modal de ayuda */}
      <HelpModal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} />
    </div>
  );
}

// DONE