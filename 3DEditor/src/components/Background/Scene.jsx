import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { GridFloor } from './Gridfloor';
import { Decorations } from './Decorations';
import { Character } from './Character';

export const Scene = () => {
  const { camera } = useThree();
  const groupRef = useRef();
  
  useEffect(() => {
    camera.position.set(8, 8, 8);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  useFrame((state) => {
    const { mouse } = state;
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        mouse.x * 0.5,
        0.1
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        mouse.y * 0.2,
        0.1
      );
    }
  });

  return (
    <group ref={groupRef}>
      <GridFloor/>
      <Decorations/>
      <Character position={[0, 0.5, 0]} />
    </group>
  );
};
