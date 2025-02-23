import { useEffect } from "react";
import { geometryDefinitions } from "./geometryDefinition";
import modelConfigs from "./modelConfigs.json";

// Function to analyze which geometries and models are used
const analyzeShapeUsage = (shapes) => {
  const usedGeometries = new Set();
  const usedImportedModels = new Set();
  const usedModels = new Set();
  const basicShapes = new Set();

  shapes.forEach((shape) => {
    if (shape.type === "importedModel") {
      usedImportedModels.add(shape.modelType);
    } else if (modelConfigs[shape.type]) {
      usedModels.add(shape.type);
    } else if (geometryDefinitions[shape.type]) {
      usedGeometries.add(shape.type);
    } else {
      basicShapes.add(shape.type);
    }
  });

  return { usedGeometries, usedModels, usedImportedModels, basicShapes };
};

// Generate imports section
const generateImports = () => {
  return `import React, { useState, Suspense, useRef, useEffect } from 'react';
  import { Canvas } from '@react-three/fiber';
  import { OrbitControls } from '@react-three/drei';
  import { useGLTF } from "@react-three/drei";
  import { useTexture } from "@react-three/drei";
  import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
  import { useLoader } from "@react-three/fiber";
  import { useFrame } from "@react-three/fiber";
  import * as THREE from 'three';`;
};

// Generate geometry functions
const generateGeometryFunctions = (usedGeometries) => {
  return Array.from(usedGeometries)
    .map((type) => geometryDefinitions[type])
    .join("\n\n");
};

// Generate the CustomGeometry component only if needed
const generateCustomGeometryComponent = (usedGeometries) => {
  if (usedGeometries.size === 0) return "";

  const geometrySwitch = Array.from(usedGeometries)
    .map(
      (type) => `      case '${type}':
          geometry = create${
            type.charAt(0).toUpperCase() + type.slice(1)
          }Geometry();
          break;`
    )
    .join("\n");

  return `
  const CustomGeometry = ({ type, ...props }) => {
    const geometryRef = useRef();
    
    useEffect(() => {
      let geometry;
      switch(type) {
  ${geometrySwitch}
      }
      if (geometryRef.current) {
        geometryRef.current.geometry = geometry;
      }
    }, [type]);
  
    return <mesh ref={geometryRef} {...props} />;
  };`;
};

// Model component for loading GLTF models
const generateModelComponent = (usedModels) => {
  if (usedModels.size === 0) return "";

  return `
    const Model = ({ modelPath, position, rotation, scale, defaultScale = 1 }) => {
      const gltf = useGLTF(modelPath);
      const scene = gltf.scene.clone();
      
      scene.traverse((node) => {
        if (node.isMesh) {
          node.material = node.material.clone();
          node.material.emissiveIntensity = 0;
          node.material.transparent = false;
          node.material.opacity = 1;
        }
      });
      
      scene.scale.set(scale * defaultScale, scale * defaultScale, scale * defaultScale);
      
      return <primitive object={scene} />;
    };`;
};

const generateImportedModelComponent = (usedImportedModels) => {
  if (usedImportedModels.size === 0) return "";

  return `const ImportedModel = ({ shape }) => {
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
              <meshStandardMaterial color={shape.color} />
            </mesh>
          );
        default:
          return null;
      }
    } catch (error) {
      console.error("Error loading model:", error);
      return null;
    }
  };`;
};

const generateCustomAnimationFunctions = () => {
  return `
  const useCurrentFrame = (maxFrames = 100, speed = 1) => {
    const [currentFrame, setCurrentFrame] = useState(0);
    const direction = useRef(1); // 1 for forward, -1 for reverse
  
    useFrame(() => {
      setCurrentFrame((prev) => {
        let nextFrame = prev + direction.current * speed;
        if (nextFrame >= maxFrames) {
          nextFrame = maxFrames;
          direction.current = -1;
        } else if (nextFrame <= 0) {
          nextFrame = 0;
          direction.current = 1;
        }
        return nextFrame;
      });
    });
  
    return currentFrame;
  };

  const lerp = (start, end, t) => {
    if (Array.isArray(start)) {
      return start.map((s, i) => s + (end[i] - s) * t);
    }
    return start + (end - start) * t;
  };

  const findNearestKeyframes = (frameData, currentFrame) => {
    if (!frameData) return { before: null, after: null };

    const frames = Object.keys(frameData)
      .map(Number)
      .sort((a, b) => a - b);

    const beforeFrame = frames.reduce((prev, frame) => {
      if (frame <= currentFrame && frame > prev) return frame;
      return prev;
    }, -Infinity);

    const afterFrame = frames.reduce((prev, frame) => {
      if (frame > currentFrame && (prev === Infinity || frame < prev))
        return frame;
      return prev;
    }, Infinity);

    return {
      before: beforeFrame === -Infinity ? null : beforeFrame,
      after: afterFrame === Infinity ? null : afterFrame,
    };
  };

  const getInterpolatedValues = (frameData, currentFrame) => {
    if (!frameData) return null;

    const { before, after } = findNearestKeyframes(frameData, currentFrame);

    if (before === null && after === null) return null;
    if (after === null) return frameData[before];
    if (before === null) return frameData[after];

    const t = (currentFrame - before) / (after - before);

    return {
      position: lerp(frameData[before].position, frameData[after].position, t),
    };
  };`;
};

// Helper function to generate JSX for each shape
const generateShapeJSX = (shape, shapeAnimationData) => {
  const { position, rotation, scale, color, type, texturePath } = shape;
  const pos = `[${position.join(", ")}]`;
  const rot = `[${rotation.join(", ")}]`;

  const isModelType = modelConfigs[type];
  const texture = texturePath ? `useTexture('${texturePath}')` : "null";

  let jsx = `<mesh position={${
    shapeAnimationData && Object.keys(shapeAnimationData).length
      ? `getInterpolatedValues(${JSON.stringify(
          shapeAnimationData
        )}, currentFrame)?.position`
      : pos
  }} rotation={${rot}} scale={[${scale}, ${scale}, ${scale}]}>`;

  if (shape.type === "importedModel") {
    return `<ImportedModel shape={${JSON.stringify(shape)}} />`;
  }

  if (isModelType) {
    return `${jsx} <Model modelPath="${modelConfigs[type].path}" position={${pos}} rotation={${rot}} scale={${scale}} defaultScale={${modelConfigs[type].scale}} /></mesh>`;
  }

  if (geometryDefinitions[type]) {
    return `${jsx}
            <CustomGeometry
                type="${type}"
                position={${pos}}
                rotation={${rot}}
                scale={[${scale}, ${scale}, ${scale}]}>
                <meshStandardMaterial color="${color}" />
              </CustomGeometry>
              </mesh>`;
  }

  return `${jsx}
            <${type === "cube" ? "box" : type}Geometry />
            <meshStandardMaterial color="${color}" map={${texture}} />
          </mesh>`;
};

const generateModelObject = () => {
  return `const ModelObject = ({
            children,
            shape,
            animationStates = {},
            shapeAnimationData,
            setCurrentFrame,
          }) => {
            const meshRef = useRef();
            const [offset] = useState(Math.random() * Math.PI * 2);
            const initialPosition = shape.position;
            
            setCurrentFrame(useCurrentFrame());
            
            useFrame(({ clock, mouse }) => {
              if (!meshRef.current || !animationStates[shape.id]) return;
          
              const animations = animationStates[shape.id];
              const basePosition = Array.isArray(initialPosition)
                ? initialPosition
                : [0, 0, 0];
              let newPosition = [...basePosition];
              let newScale = shape.scale || 1;
              const config = { rotationX: 0.2, rotationY: 0.5, lerpSpeed: 0.1 };
          
              if (animations?.hovering) {
                meshRef.current.rotation.y = THREE.MathUtils.lerp(
                  meshRef.current.rotation.y,
                  mouse.x * (config.rotationY || 0.5),
                  config.lerpSpeed || 0.1
                );
          
                meshRef.current.rotation.x = THREE.MathUtils.lerp(
                  meshRef.current.rotation.x,
                  mouse.y * (config.rotationX || 0.2),
                  config.lerpSpeed || 0.1
                );
              }
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
          };`;
};
const addModel = (shape, animationStates, animationData) => {
  return `<ModelObject
              key={${shape.id}}
              shape={${JSON.stringify(shape)}}
              animationStates={${JSON.stringify(animationStates)}}
              animationData={${JSON.stringify(animationData[shape.id])}}
              setCurrentFrame={setCurrentFrame}
            >
            ${generateShapeJSX(shape, animationData[shape.id])}
            </ModelObject>`;
};

// Main export function
export const exportScene = (shapes, animationStates, animationData) => {
  const { usedGeometries, usedModels, usedImportedModels, basicShapes } =
    analyzeShapeUsage(shapes);

  const componentCode = `${generateImports()}
    
  ${generateGeometryFunctions(usedGeometries)}
  ${generateCustomGeometryComponent(usedGeometries)}
  ${generateModelComponent(usedModels)}
  ${generateImportedModelComponent(usedImportedModels)}
  ${generateModelObject()}
  ${generateCustomAnimationFunctions()}
    
  const Scene = () => {
    const [currentFrame, setCurrentFrame] = useState(0);

    return (
      <div className="absolute inset-0">
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />
        <OrbitControls makeDefault />
          ${shapes.map((shape) =>
            addModel(shape, animationStates, animationData)
          )}
      </Canvas>
      </div>
    );
  };
  
  export default Scene;`;

  // Create and download the file
  const blob = new Blob([componentCode], { type: "text/javascript" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "CompiledScene.jsx";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Export button component
export const ExportButton = ({ shapes, animationStates, animationData }) => {
  return (
    <button
      onClick={() => exportScene(shapes, animationStates, animationData)}
      style={{
        padding: "10px 20px",
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "16px",
      }}
    >
      Export Scene
    </button>
  );
};
