import React, { Suspense, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useGLTF } from "@react-three/drei";
import { useTexture } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

const ImportedModel = ({ shape }) => {
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
            <meshStandardMaterial color={shape.color} opacity={1} />
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

const CompiledScene = () => {
  return (
    <div className="absolute inset-0">
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />
        <OrbitControls makeDefault />
        <Suspense fallback={null}>
          <ImportedModel
            shape={{
              id: 1740250981042,
              type: "importedModel",
              modelUrl:
                "blob:http://localhost:5173/103bf32b-e790-4ef5-a723-1d328d40ba21",
              modelType: "glb",
              position: [0, 0, 0],
              rotation: [0, 0, 0],
              scale: 1,
              color: "#888888",
              name: "mini_robot.glb",
            }}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default CompiledScene;
