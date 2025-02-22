import React, { Suspense, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const createPrismGeometry = () => {
  return new THREE.CylinderGeometry(1, 1, 1, 6);
};

const createStairsGeometry = () => {
  const steps = 5;
  const width = 1;
  const stepHeight = 0.2;
  const stepDepth = 0.3;

  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  const indices = [];
  const normals = [];
  const uvs = [];

  for (let i = 0; i < steps; i++) {
    const y = i * stepHeight;
    const z = -i * stepDepth;

    vertices.push(
      -width / 2,
      y,
      z,
      width / 2,
      y,
      z,
      width / 2,
      y + stepHeight,
      z,
      -width / 2,
      y + stepHeight,
      z,
      -width / 2,
      y + stepHeight,
      z,
      width / 2,
      y + stepHeight,
      z,
      width / 2,
      y + stepHeight,
      z - stepDepth,
      -width / 2,
      y + stepHeight,
      z - stepDepth
    );

    const baseIndex = i * 8;
    indices.push(
      baseIndex,
      baseIndex + 1,
      baseIndex + 2,
      baseIndex,
      baseIndex + 2,
      baseIndex + 3,
      baseIndex + 4,
      baseIndex + 5,
      baseIndex + 6,
      baseIndex + 4,
      baseIndex + 6,
      baseIndex + 7
    );

    normals.push(
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0
    );

    uvs.push(0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1);
  }

  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3)
  );
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);

  return geometry;
};

const CustomGeometry = ({ type, ...props }) => {
  const geometryRef = useRef();

  useEffect(() => {
    let geometry;
    switch (type) {
      case "prism":
        geometry = createPrismGeometry();
        break;
      case "stairs":
        geometry = createStairsGeometry();
        break;
    }
    if (geometryRef.current) {
      geometryRef.current.geometry = geometry;
    }
  }, [type]);

  return <mesh ref={geometryRef} {...props} />;
};

const CompiledScene = () => {
  return (
    <div className="absolute inset-0">
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />
        <OrbitControls makeDefault />
        <Suspense fallback={null}>
          <mesh
            position={[-2.2, 0, -0.1]}
            rotation={[0, 0, 0]}
            scale={[1, 1, 1]}
          >
            <sphereGeometry args={[0.7, 32, 32]} />
            <meshStandardMaterial color="#888888" />
          </mesh>
          <mesh position={[0, 0.2, -3]} rotation={[0, 0, 0]} scale={[1, 1, 1]}>
            <octahedronGeometry args={[0.8]} />
            <meshStandardMaterial color="#888888" />
          </mesh>
          <CustomGeometry
            type="prism"
            position={[-0.2, -2.2, -0.6]}
            rotation={[0, 0, 0]}
            scale={[1, 1, 1]}
          >
            <meshStandardMaterial color="#888888" />
          </CustomGeometry>
          <CustomGeometry
            type="stairs"
            position={[1.8, 1.2, 0]}
            rotation={[0, 0, 0]}
            scale={[1, 1, 1]}
          >
            <meshStandardMaterial color="#888888" />
          </CustomGeometry>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default CompiledScene;
