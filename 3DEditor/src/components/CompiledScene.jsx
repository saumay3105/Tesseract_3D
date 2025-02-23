import React, { useState, Suspense, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useGLTF } from "@react-three/drei";
import { useTexture } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useLoader } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const ModelObject = ({
  children,
  shape,
  animationStates = {},
  shapeAnimationData,
}) => {
  const meshRef = useRef();
  const [offset] = useState(Math.random() * Math.PI * 2);
  const initialPosition = shape.position;

  useFrame(({ clock }) => {
    if (!meshRef.current || !animationStates[shape.id]) return;
    const animations = animationStates[shape.id];
    const basePosition = Array.isArray(initialPosition)
      ? initialPosition
      : [0, 0, 0];
    let newPosition = [...basePosition];
    let newScale = shape.scale || 1;
    if (animations?.rotating) {
      meshRef.current.rotation.y += 0.02;
    }
    if (animations?.floating) {
      newPosition[1] =
        basePosition[1] + Math.sin(clock.elapsedTime + offset) * 0.2;
    }
    if (animations?.scaling) {
      newScale = shape.scale * (1 + Math.sin(clock.elapsedTime * 2) * 0.2);
    }
    if (animations?.pulsing) {
      newScale = shape.scale * (1 + Math.sin(clock.elapsedTime * 4) * 0.1);
    }
    if (animations?.bouncing) {
      newPosition[1] =
        basePosition[1] + Math.abs(Math.sin(clock.elapsedTime * 3)) * 0.3;
    }
    meshRef.current.position.set(...newPosition);
    if (newScale !== shape.scale) {
      meshRef.current.scale.set(newScale, newScale, newScale);
    }
  });

  return <mesh ref={meshRef}>{children}</mesh>;
};

const Scene = () => {
  return (
    <div className="absolute inset-0">
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />
        <OrbitControls makeDefault />
        <ModelObject
          key={1740294407266}
          shape={{
            id: 1740294407266,
            type: "sphere",
            icon: "○",
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            color: "#888888",
            scale: 1,
          }}
          animationStates={{
            1740294407266: { bouncing: true },
            1740295501840: { rotating: true },
          }}
        >
          <mesh position={[0, 0, 0]} rotation={[0, 0, 0]} scale={[1, 1, 1]}>
            <sphereGeometry />
            <meshStandardMaterial color="#888888" map={null} />
          </mesh>
        </ModelObject>
        ,
        <ModelObject
          key={1740295501840}
          shape={{
            id: 1740295501840,
            type: "cube",
            icon: "⧈",
            position: [0, 1.94, 0],
            rotation: [1.9547687622336491, 0, 0],
            color: "#888888",
            scale: 1,
          }}
          animationStates={{
            1740294407266: { bouncing: true },
            1740295501840: { rotating: true },
          }}
        >
          <mesh
            position={[0, 1.94, 0]}
            rotation={[1.9547687622336491, 0, 0]}
            scale={[1, 1, 1]}
          >
            <boxGeometry />
            <meshStandardMaterial color="#888888" map={null} />
          </mesh>
        </ModelObject>
      </Canvas>
    </div>
  );
};

export default Scene;
