import { useState } from 'react';
import { CoordinateParser } from './components/CoordinateParser';
import { CoordinatesTable } from './components/CoordinatesTable';
import { calculatePlaneEquation } from './utils/planeCalculator';
import { PlaneEquationDisplay } from './components/PlaneEquationDisplay';
import { MeasurementParser } from './components/MeasurementParser';
import { compareVerticalDistances } from './utils/comparison';
import { ComparisonResults } from './components/ComparisonResults';
import HelpModal from './components/HelpModal';

export default function App() {
  const [sopCoordinates, setSopCoordinates] = useState([]);
  const [measuredCoordinates, setMeasuredCoordinates] = useState([]);
  const [planeEquation, setPlaneEquation] = useState(null);
  const [verticalDistances, setVerticalDistances] = useState(null);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  const handleSopParse = (parsedCoordinates) => {
    setSopCoordinates(parsedCoordinates);
    if (parsedCoordinates.length >= 3) {
      setPlaneEquation(calculatePlaneEquation(parsedCoordinates));
    } else {
      setPlaneEquation(null);
    }
    setVerticalDistances(null); // Reset vertical distances when SOP changes
  };

  const handleMeasurementParse = (parsedCoordinates) => {
    setMeasuredCoordinates(parsedCoordinates);
    if (planeEquation) {
      setVerticalDistances(compareVerticalDistances(parsedCoordinates, planeEquation));
    } else if (sopCoordinates.length >= 3) {
       // Recalculate plane if SOP was already present
       const newPlane = calculatePlaneEquation(sopCoordinates);
       setPlaneEquation(newPlane);
       setVerticalDistances(compareVerticalDistances(parsedCoordinates, newPlane));
    } else {
       setVerticalDistances(null);
    }
  };

  const resetSopData = () => {
    setSopCoordinates([]);
    setPlaneEquation(null);
    setVerticalDistances(null);
  };

  const resetMeasurementData = () => {
    setMeasuredCoordinates([]);
    setVerticalDistances(null);
  };

  const resetAllData = () => {
    resetSopData();
    resetMeasurementData();
  };

  const loadSimulationData = () => {
    const sopData = `a	2114.650	6007.800	8.217
b	2124.310	6007.800	8.080
c	2114.650	6011.800	8.274`;

    const measuredData = `1	2124.252	6011.666	8.152
2	2124.212	6011.657	8.153
3	2124.223	6011.623	8.153
4	2124.137	6011.612	8.154
5	2124.158	6011.540	8.153
6	2124.181	6011.424	8.152
7	2124.045	6011.408	8.154
8	2124.012	6011.489	8.155
9	2123.885	6011.464	8.156
10	2123.908	6011.367	8.154
11	2124.065	6011.400	8.154
12	2124.086	6011.203	8.152
13	2123.875	6011.184	8.152
14	2123.894	6011.057	8.151
15	2123.931	6011.041	8.153
16	2123.995	6010.949	8.150
17	2123.929	6010.952	8.149
18	2123.802	6010.942	8.150
19	2123.853	6010.855	8.151
20	2123.853	6010.696	8.149
21	2123.644	6010.694	8.143
22	2123.631	6010.529	8.148
23	2123.375	6010.542	8.149
24	2123.375	6010.679	8.150
25	2123.371	6010.778	8.151
26	2123.363	6010.928	8.151
27	2123.353	6011.038	8.152
28	2123.296	6011.333	8.158
29	2123.395	6011.514	8.159
30	2123.617	6011.672	8.159
31	2123.688	6011.897	8.162
32	2123.902	6011.945	8.159
33	2123.821	6012.137	8.165
34	2123.346	6011.968	8.167
35	2123.132	6011.892	8.169
36	2123.201	6011.708	8.165
37	2122.927	6011.630	8.170
38	2122.991	6011.432	8.166
39	2122.755	6011.381	8.168
40	2122.483	6011.168	8.167
41	2122.520	6010.935	8.165
42	2122.471	6011.343	8.182
43	2122.604	6011.633	8.172
44	2122.634	6011.644	8.175
45	2123.056	6011.980	8.187
46	2123.234	6012.186	8.169
47	2123.468	6012.454	8.174
48	2123.291	6012.425	8.176
49	2123.186	6012.594	8.183
50	2122.864	6012.503	8.170
51	2122.740	6012.637	8.187
52	2122.844	6012.856	8.187
53	2122.779	6012.929	8.187
54	2122.668	6012.986	8.188
55	2122.310	6012.709	8.185
56	2122.437	6012.511	8.191
57	2122.116	6011.968	8.183
58	2121.896	6011.989	8.186
59	2121.669	6012.031	8.188
60	2121.955	6011.515	8.177
61	2122.001	6011.392	8.175
62	2121.886	6014.049	8.210
63	2121.613	6014.184	8.216
64	2121.471	6014.457	8.221
65	2121.286	6014.067	8.220
66	2121.274	6014.431	8.224
67	2121.171	6014.483	8.227
68	2120.898	6014.557	8.231
69	2120.810	6014.257	8.233
70	2120.875	6013.971	8.226
71	2121.020	6013.528	8.193
72	2121.638	6013.101	8.208
73	2121.317	6012.923	8.190
74	2120.992	6012.657	8.205
75	2121.471	6012.529	8.201
76	2120.916	6011.942	8.195
77	2120.966	6011.176	8.189
78	2120.934	6010.045	8.174
79	2121.193	6009.924	8.179
80	2121.231	6009.586	8.161
81	2121.005	6009.316	8.161
82	2120.872	6009.543	8.149
83	2120.607	6011.514	8.198
84	2120.545	6011.783	8.203
85	2120.512	6011.939	8.215
86	2120.544	6012.451	8.226
87	2120.542	6013.146	8.223
88	2120.422	6013.654	8.230
89	2120.549	6014.172	8.233
90	2120.126	6014.247	8.242
91	2120.068	6013.818	8.229
92	2119.700	6013.836	8.234
93	2119.541	6014.285	8.248
94	2119.100	6014.230	8.254
95	2118.583	6014.201	8.263
96	2118.574	6013.710	8.257
97	2118.560	6013.141	8.246
98	2118.458	6012.598	8.240
99	2119.437	6012.468	8.227
100	2119.042	6011.933	8.227
101	2118.709	6011.712	8.227
102	2118.481	6011.520	8.226
103	2118.078	6012.449	8.248
104	2118.084	6012.760	8.249
105	2118.015	6013.140	8.255
106	2118.035	6013.497	8.263
107	2118.052	6013.847	8.269
108	2118.011	6014.211	8.268
109	2117.683	6014.062	8.272
110	2117.518	6014.340	8.286
111	2117.437	6014.303	8.283
112	2117.136	6014.101	8.283
113	2116.727	6013.741	8.284
114	2116.505	6013.512	8.284
115	2116.163	6013.073	8.286
116	2115.961	6012.774	8.282
117	2115.693	6012.425	8.282
118	2116.314	6012.421	8.270
119	2116.689	6012.407	8.265
120	2117.161	6012.388	8.260
121	2117.549	6012.371	8.256
122	2115.171	6012.150	8.282
123	2115.122	6012.011	8.281
124	2115.041	6011.753	8.279
125	2114.762	6011.819	8.282
126	2114.713	6011.622	8.280
127	2115.016	6011.562	8.278
128	2115.553	6011.458	8.271
129	2116.145	6011.342	8.263
130	2116.229	6011.670	8.265
131	2116.621	6011.549	8.260
132	2117.257	6011.362	8.249
133	2117.425	6011.312	8.221
134	2117.801	6011.201	8.235
135	2118.032	6010.991	8.230
136	2118.003	6010.822	8.228
137	2117.999	6010.442	8.219
138	2118.083	6010.035	8.212
139	2117.342	6009.999	8.224
140	2116.902	6010.053	8.234
141	2116.361	6010.036	8.242
142	2115.891	6009.942	8.246
143	2115.177	6009.956	8.256
144	2114.862	6009.589	8.248
145	2114.909	6009.345	8.245
146	2115.730	6009.572	8.237
147	2115.457	6009.331	8.237
148	2116.352	6009.553	8.229
149	2116.869	6009.587	8.221
150	2117.468	6009.674	8.211
151	2117.944	6009.612	8.202
152	2118.100	6009.393	8.204
153	2118.071	6008.895	8.200
154	2117.625	6009.127	8.204
155	2117.291	6008.908	8.213
156	2116.665	6008.758	8.215
157	2116.395	6008.619	8.228
158	2115.673	6008.404	8.223
159	2115.009	6008.143	8.231
160	2115.171	6007.812	8.226
161	2115.047	6007.673	8.232
162	2115.309	6007.504	8.218
163	2115.938	6007.588	8.211
164	2116.297	6007.479	8.205
165	2116.677	6007.498	8.201
166	2117.336	6007.573	8.189
167	2117.958	6007.425	8.176
168	2117.827	6007.075	8.175
169	2117.525	6007.085	8.179
170	2117.246	6007.014	8.193
171	2116.619	6006.993	8.195
172	2115.897	6006.920	8.204
173	2116.208	6006.586	8.195
174	2116.522	6006.310	8.188
175	2117.183	6006.149	8.179
176	2117.882	6005.959	8.167
177	2117.953	6005.274	8.155
178	2117.662	6005.198	8.157
179	2117.338	6005.358	8.165
180	2116.944	6005.582	8.171
181	2118.479	6006.641	8.158
182	2119.053	6006.890	8.158
183	2118.799	6005.335	8.140
184	2119.711	6007.216	8.157
185	2120.155	6007.914	8.160
186	2118.551	6007.469	8.169
187	2118.828	6008.256	8.182
188	2118.467	6008.806	8.190
189	2119.570	6008.683	8.175
190	2120.373	6009.056	8.168
191	2121.002	6009.414	8.174
192	2121.238	6008.539	8.147
193	2121.198	6008.547	8.147
194	2121.036	6008.416	8.148
195	2121.295	6008.385	8.144
196	2121.579	6008.368	8.136
197	2122.043	6008.373	8.129
198	2122.504	6008.356	8.125
199	2122.352	6008.109	8.122
200	2121.976	6007.950	8.126
201	2121.405	6007.810	8.131
202	2121.083	6007.588	8.136
203	2121.458	6007.417	8.130
204	2121.902	6007.423	8.120
205	2122.279	6007.411	8.113
206	2122.271	6007.118	8.113
207	2121.964	6007.004	8.115
208	2121.621	6006.971	8.117
209	2121.393	6007.131	8.122
210	2121.152	6007.017	8.124
211	2120.849	6007.165	8.128
212	2120.985	6006.617	8.120
213	2121.324	6006.378	8.113
214	2121.401	6006.119	8.112
215	2121.113	6006.130	8.114
216	2120.938	6006.014	8.116
217	2120.795	6005.931	8.113
218	2120.974	6005.633	8.108
219	2120.886	6005.347	8.105
220	2120.945	6005.134	8.102
221	2121.205	6005.271	8.103
222	2121.450	6005.091	8.096
223	2121.531	6005.278	8.100
224	2121.715	6005.415	8.100
225	2121.895	6005.505	8.097
226	2121.956	6005.763	8.099
227	2122.153	6005.769	8.097
228	2122.272	6005.929	8.101
229	2122.177	6006.148	8.104
230	2122.251	6006.484	8.106
231	2122.467	6006.376	8.105
232	2122.174	6006.873	8.112
233	2122.156	6007.098	8.113
234	2122.437	6007.154	8.110
235	2122.652	6006.927	8.108
236	2122.810	6006.665	8.105
237	2123.007	6006.766	8.102
238	2123.160	6006.865	8.101
239	2123.227	6007.048	8.100
240	2123.143	6007.133	8.101
241	2123.334	6007.043	8.098
242	2123.541	6007.162	8.094
243	2122.351	6007.624	8.115
244	2122.656	6007.738	8.115
245	2123.075	6007.795	8.112
246	2123.466	6007.755	8.109
247	2123.568	6007.615	8.105
248	2123.875	6007.748	8.104
249	2123.869	6008.020	8.108
250	2124.087	6008.106	8.106
251	2124.217	6007.966	8.098
252	2124.183	6008.240	8.105
253	2123.885	6008.369	8.112
254	2123.466	6008.288	8.117
255	2122.959	6008.478	8.124
256	2122.628	6008.471	8.127
257	2122.348	6008.552	8.128
258	2122.951	6008.856	8.129
259	2123.326	6008.935	8.127
260	2123.854	6008.873	8.119
261	2124.109	6008.754	8.115
262	2123.954	6009.150	8.116
263	2123.643	6009.287	8.124
264	2123.272	6009.409	8.130
265	2123.772	6009.619	8.123
266	2124.099	6009.607	8.119
267	2122.595	6009.288	8.136
268	2122.109	6009.143	8.140
269	2121.708	6008.961	8.140
270	2119.587	6009.567	8.186
271	2118.749	6010.068	8.207
272	2118.808	6011.315	8.217
273	2119.423	6011.704	8.216
274	2120.318	6011.512	8.202
275	2120.630	6010.150	8.178
276	2120.413	6009.864	8.182
277	2119.537	6005.945	8.140
278	2119.138	6005.179	8.137
279	2119.215	6005.921	8.144
280	2119.822	6007.408	8.159
281	2123.083	6010.095	8.145
282	2122.353	6010.235	8.155
283	2121.641	6010.380	8.165
284	2116.745	6010.829	8.250
285	2115.915	6010.878	8.262
286	2114.929	6010.937	8.274
287	2114.902	6010.543	8.268`;

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
          className={`px-3 py-1 rounded ${sopCoordinates.length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600 text-white'}`}
        >
          Reset SOP
        </button>
        <button
          onClick={resetMeasurementData}
          disabled={measuredCoordinates.length === 0}
          className={`px-3 py-1 rounded ${measuredCoordinates.length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600 text-white'}`}
        >
          Reset Mediciones
        </button>
        <button
          onClick={resetAllData}
          disabled={sopCoordinates.length === 0 && measuredCoordinates.length === 0}
          className={`px-3 py-1 rounded ${sopCoordinates.length === 0 && measuredCoordinates.length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white'}`}
        >
          Reset Todo
        </button>
        <button
          onClick={loadSimulationData}
          className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
        >
          Cargar Simulación
        </button>
        <button
          onClick={() => setIsHelpModalOpen(true)}
          className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
        >
          Ayuda
        </button>
      </div>

      <CoordinateParser onParse={handleSopParse} />
      
      {sopCoordinates.length > 0 && (
        <CoordinatesTable data={sopCoordinates} />
      )}

      {planeEquation && sopCoordinates.length >= 3 && (
        <PlaneEquationDisplay equation={planeEquation} />
      )}

      <MeasurementParser onParse={handleMeasurementParse} />

      {verticalDistances && verticalDistances.length > 0 && (
        <ComparisonResults 
          sopCoordinates={sopCoordinates}
          verticalDistances={verticalDistances} 
        />
      )}

      {measuredCoordinates.length > 0 && !verticalDistances && planeEquation && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
          Calculando desviaciones verticales...
        </div>
      )}

      {measuredCoordinates.length > 0 && !planeEquation && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
          Necesitas primero definir al menos 3 puntos SOP para calcular el plano de referencia.
        </div>
      )}

      {/* Renderizar el modal de ayuda */}
      <HelpModal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} />
    </div>
  );
}

// DONE