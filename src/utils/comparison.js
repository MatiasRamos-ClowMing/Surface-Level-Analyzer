import { calculateVerticalDistanceToPlane } from './distanceCalculator';

export const compareVerticalDistances = (measuredCoords, planeEquation) => {
  if (!planeEquation) return null;
  
  return measuredCoords.map(measured => {
    const verticalDistance = calculateVerticalDistanceToPlane(measured, planeEquation);
    
    return {
      id: measured.id,
      x: measured.x,
      y: measured.y,
      z: measured.z,
      verticalDistance
    };
  });
};