import React, { useState, Suspense, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text3D } from "@react-three/drei";
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
          key={1740300992340}
          shape={{
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            color: "#662e2e",
            scale: 1.3,
            type: "ThreeDText",
            text: "miran",
            height: 0.3,
            icon: "📝",
            id: 1740300992340,
          }}
          animationStates={{
            1740300992340: { hovering: false, bouncing: true },
          }}
        >
          <mesh
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
            scale={[1.3, 1.3, 1.3]}
          >
            <Text3D
              font="/fonts/helvetiker_regular.typeface.json"
              size={1.3}
              height={0.3}
              curveSegments={12}
              bevelEnabled={true}
              bevelThickness={0.01}
              bevelSize={0.02}
              bevelOffset={0}
              bevelSegments={5}
            >
              miran
              <meshStandardMaterial color="#662e2e" />
            </Text3D>
          </mesh>
        </ModelObject>
      </Canvas>
    </div>
  );
};

export default Scene;
