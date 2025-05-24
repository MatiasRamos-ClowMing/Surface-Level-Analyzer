export const calculateVerticalDistanceToPlane = (point, plane) => {
  if (plane.C === 0) return Infinity;
  
  const zPlane = (-plane.A * point.x - plane.B * point.y - plane.D) / plane.C;
  // Seguimos calculando con precisión decimal internamente
  return (point.z - zPlane) * 1000; 
};

// DONE