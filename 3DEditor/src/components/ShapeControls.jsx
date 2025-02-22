import { useRef, useState, Suspense, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import {
  TransformControls,
  Text,
  useGLTF,
  useFBX,
  useTexture,
} from "@react-three/drei";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

import modelConfigs from "./modelConfigs.json";

// Model component for handling GLB models
const Model = ({ modelId, isSelected }) => {
  const gltf = useGLTF(modelConfigs[modelId].path);
  const scene = gltf.scene.clone();
  const defaultScale = modelConfigs[modelId].scale;

  scene.traverse((node) => {
    if (node.isMesh) {
      node.material = node.material.clone();
      if (isSelected) {
        node.material.emissive.set("orange");
        node.material.emissiveIntensity = 1;
        node.material.transparent = true;
        node.material.opacity = 0.5;
      } else {
        node.material.emissiveIntensity = 0;
        node.material.transparent = false;
        node.material.opacity = 1;
      }
    }
  });

  scene.scale.set(defaultScale, defaultScale, defaultScale);
  return <primitive object={scene} />;
};

// Custom geometry functions remain the same
const createPrismGeometry = () => {
  return new THREE.CylinderGeometry(1, 1, 1, 6);
};

const createCapsuleGeometry = () => {
  return new THREE.CapsuleGeometry(0.5, 1, 4, 8);
};

const createTubeGeometry = () => {
  const path = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1, 0, 0),
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(1, 0, 0),
  ]);
  return new THREE.TubeGeometry(path, 20, 0.2, 8, false);
};

const createArchGeometry = () => {
  const shape = new THREE.Shape();
  shape.moveTo(-1, 0);
  shape.lineTo(1, 0);
  shape.lineTo(1, 1.5);
  shape.absarc(0, 1.5, 1, 0, Math.PI, false);
  shape.lineTo(-1, 1.5);
  shape.lineTo(-1, 0);

  return new THREE.ExtrudeGeometry(shape, {
    steps: 1,
    depth: 0.3,
    bevelEnabled: false,
  });
};

const createStairsGeometry = () => {
  const geometry = new THREE.BufferGeometry();
  const steps = 5;
  const width = 1;
  const stepHeight = 0.2;
  const stepDepth = 0.3;

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

const createWallGeometry = () => {
  return new THREE.BoxGeometry(2, 1, 0.2);
};

const createPyramidGeometry = () => {
  return new THREE.ConeGeometry(1, 1.5, 4);
};

const ImportedModel = ({ shape, isSelected }) => {
  try {
    switch (shape.modelType) {
      case "glb":
      case "gltf":
        const model = useLoader(GLTFLoader, shape.modelUrl);
        return <primitive object={model.scene} />;
      case "obj":
        const objModel = useLoader(OBJLoader, shape.modelUrl);
        return <primitive object={objModel} />;
      case "stl":
        const geometry = useLoader(STLLoader, shape.modelUrl);
        return (
          <mesh geometry={geometry}>
            <meshStandardMaterial
              color={shape.color}
              transparent={isSelected}
              opacity={isSelected ? 0.5 : 1}
              emissive={isSelected ? "orange" : "black"}
              emissiveIntensity={isSelected ? 1 : 0}
            />
          </mesh>
        );
      default:
        return null;
    }
  } catch (error) {
    console.error("Error loading model:", error);
    return null;
  }
};

const ShapeControls = ({
  shape,
  setShapes,
  onClick,
  isSelected,
  selectedObject,
  mode = "translate",
  animationStates = {},
}) => {
  const meshRef = useRef();
  const transformRef = useRef();
  const [offset] = useState(Math.random() * Math.PI * 2);
  const initialPosition = shape.position;

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.position.set(...shape.position);
      meshRef.current.rotation.set(...shape.rotation);
    }
  }, [shape]);

  useFrame(({ clock }) => {
    if (!meshRef.current || !animationStates[shape.id]) return;

    const animations = animationStates[shape.id];
    const basePosition = Array.isArray(initialPosition)
      ? initialPosition
      : [0, 0, 0];
    let newPosition = [...basePosition];
    let newScale = shape.scale || 1;

    // Handle rotating animation
    if (animations?.rotating) {
      meshRef.current.rotation.y += 0.02;
    }

    // Handle floating animation
    if (animations?.floating) {
      newPosition[1] =
        basePosition[1] + Math.sin(clock.elapsedTime + offset) * 0.2;
    }

    // Handle scaling animation
    if (animations?.scaling) {
      newScale = shape.scale * (1 + Math.sin(clock.elapsedTime * 2) * 0.2);
    }

    // Handle pulsing animation
    if (animations?.pulsing) {
      newScale = shape.scale * (1 + Math.sin(clock.elapsedTime * 4) * 0.1);
    }

    // Handle bouncing animation
    if (animations?.bouncing) {
      newPosition[1] =
        basePosition[1] + Math.abs(Math.sin(clock.elapsedTime * 3)) * 0.3;
    }

    // Apply position updates
    meshRef.current.position.set(...newPosition);

    // Apply scale updates (if changed)
    if (newScale !== shape.scale) {
      meshRef.current.scale.set(newScale, newScale, newScale);
    }
  });

  // Check if shape is a model type
  const isModelType = Object.keys(modelConfigs).includes(shape.type);

  // Load textures if applicable
  const texture = shape.texturePath ? useTexture(shape.texturePath) : null;

  // Calculate final scale
  const finalScale = isModelType
    ? shape.scale * (modelConfigs[shape.type]?.scale || 1)
    : shape.scale;

  if (shape.isHidden) return null;

  return (
    <TransformControls
      ref={transformRef}
      object={meshRef.current}
      mode={mode}
      enabled={isSelected}
    >
      <Suspense fallback={null}>
        <mesh
          ref={meshRef}
          position={shape.position}
          scale={[finalScale, finalScale, finalScale]}
          rotation={shape.rotation}
          onClick={onClick}
          castShadow
        >
          {isModelType ? (
            <Model modelId={shape.type} isSelected={isSelected} />
          ) : shape.type === "importedModel" ? (
            <ImportedModel shape={shape} isSelected={isSelected} />
          ) : (
            <>
              {/* Basic Shapes */}
              {shape.type === "cube" && <boxGeometry args={[1, 1, 1]} />}
              {shape.type === "sphere" && (
                <sphereGeometry args={[0.7, 32, 32]} />
              )}
              {shape.type === "cone" && <coneGeometry args={[0.5, 1, 32]} />}
              {shape.type === "cylinder" && (
                <cylinderGeometry args={[0.5, 0.5, 1, 32]} />
              )}
              {shape.type === "torus" && (
                <torusGeometry args={[0.5, 0.2, 16, 100]} />
              )}
              {shape.type === "plane" && <planeGeometry args={[2, 2]} />}
              {shape.type === "pyramid" && (
                <primitive object={createPyramidGeometry()} />
              )}

              {/* Platonic Solids */}
              {shape.type === "tetrahedron" && (
                <tetrahedronGeometry args={[0.8]} />
              )}
              {shape.type === "octahedron" && (
                <octahedronGeometry args={[0.8]} />
              )}
              {shape.type === "dodecahedron" && (
                <dodecahedronGeometry args={[0.8]} />
              )}
              {shape.type === "icosahedron" && (
                <icosahedronGeometry args={[0.8]} />
              )}

              {/* Geometric Shapes */}
              {shape.type === "prism" && (
                <primitive object={createPrismGeometry()} />
              )}
              {shape.type === "capsule" && (
                <primitive object={createCapsuleGeometry()} />
              )}
              {shape.type === "tube" && (
                <primitive object={createTubeGeometry()} />
              )}

              {/* Architectural Elements */}
              {shape.type === "arch" && (
                <primitive object={createArchGeometry()} />
              )}
              {shape.type === "stairs" && (
                <primitive object={createStairsGeometry()} />
              )}
              {shape.type === "wall" && (
                <primitive object={createWallGeometry()} />
              )}

              <meshStandardMaterial
                color={isSelected ? "yellow" : shape.color}
                map={texture}
                emissive={isSelected ? "orange" : "black"}
                emissiveIntensity={isSelected ? 1 : 0}
                transparent={true}
                opacity={isSelected ? 0.5 : 1}
              />
            </>
          )}
        </mesh>
      </Suspense>
    </TransformControls>
  );
};

// Preload all models
Object.values(modelConfigs).forEach((config) => {
  useGLTF.preload(config.path);
});

export default ShapeControls;
