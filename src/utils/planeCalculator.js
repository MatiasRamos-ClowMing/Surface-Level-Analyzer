export const calculatePlaneEquation = (points) => {
  // Extraemos los tres puntos
  const p1 = points[0];
  const p2 = points[1];
  const p3 = points[2];

  // Calculamos dos vectores en el plano
  const v1 = {
    x: p2.x - p1.x,
    y: p2.y - p1.y,
    z: p2.z - p1.z
  };
  
  const v2 = {
    x: p3.x - p1.x,
    y: p3.y - p1.y,
    z: p3.z - p1.z
  };

  // Producto cruz para obtener el vector normal (A, B, C)
  const A = v1.y * v2.z - v1.z * v2.y;
  const B = v1.z * v2.x - v1.x * v2.z;
  const C = v1.x * v2.y - v1.y * v2.x;
  
  // Calculamos D usando uno de los puntos
  const D = -(A * p1.x + B * p1.y + C * p1.z);

  return { A, B, C, D };
};