import React from 'react';

export const GridFloor = () => {
  const positions = [];
  const colors = ['#6366f1', '#8b5cf6', '#1f1f23'];
  
  for (let x = -3; x <= 3; x++) {
    for (let z = -3; z <= 3; z++) {
      positions.push([x * 2, -0.5, z * 2]);
    }
  }

  return positions.map((pos, idx) => (
    <mesh key={idx} position={pos}>
      <boxGeometry args={[1.8, 0.2, 1.8]} />
      <meshStandardMaterial 
        color={colors[idx % colors.length]} 
        opacity={0.8}
        transparent
      />
    </mesh>
  ));
};