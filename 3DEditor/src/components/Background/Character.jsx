import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export const Character = ({ position }) => {
  const ref = useRef();
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group ref={ref} position={position}>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[0, 0.7, 0.2]}>
        <boxGeometry args={[0.2, 0.4, 0.2]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh position={[0, 0.7, -0.2]}>
        <boxGeometry args={[0.2, 0.4, 0.2]} />
        <meshStandardMaterial color="black" />
      </mesh>
    </group>
  );
};