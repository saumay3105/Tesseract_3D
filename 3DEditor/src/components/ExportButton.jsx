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
const generateImports = (usedGeometries, basicShapes) => {
  return `import React, { Suspense, useRef, useEffect } from 'react';
  import { Canvas } from '@react-three/fiber';
  import { OrbitControls } from '@react-three/drei';
  import { useGLTF } from "@react-three/drei";
  import { useTexture } from "@react-three/drei";
  import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
  import { useLoader } from "@react-three/fiber";
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
      
      scene.position.set(...position);
      scene.rotation.set(...rotation);
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
              <meshStandardMaterial
                color={shape.color}
                opacity={1}
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
  };`;
};

// Helper function to generate JSX for each shape
const generateShapeJSX = (shape) => {
  const { position, rotation, scale, color, type, texturePath } = shape;
  const pos = `[${position.join(", ")}]`;
  const rot = `[${rotation.join(", ")}]`;

  const isModelType = modelConfigs[type];
  const texture = texturePath ? `useTexture('${texturePath}')` : "null";

  if (shape.type === "importedModel") {
    return `<ImportedModel shape={${JSON.stringify(shape)}} />`;
  }

  if (isModelType) {
    return `<Model modelPath="${modelConfigs[type].path}" position={${pos}} rotation={${rot}} scale={${scale}} defaultScale={${modelConfigs[type].scale}} />`;
  }

  if (geometryDefinitions[type]) {
    return `<CustomGeometry
                type="${type}"
                position={${pos}}
                rotation={${rot}}
                scale={[${scale}, ${scale}, ${scale}]}>
                <meshStandardMaterial color="${color}" />
              </CustomGeometry>`;
  }

  return `<mesh position={${pos}} rotation={${rot}} scale={[${scale}, ${scale}, ${scale}]}>
              <${type}Geometry />
              <meshStandardMaterial color="${color}" map={${texture}} />
            </mesh>`;
};

// Main export function
export const exportScene = (shapes, modelConfigs) => {
  const { usedGeometries, usedModels, usedImportedModels, basicShapes } =
    analyzeShapeUsage(shapes);

  const componentCode = `${generateImports()}
    
    ${generateGeometryFunctions(usedGeometries)}
    ${generateCustomGeometryComponent(usedGeometries)}
    ${generateModelComponent(usedModels)}
    ${generateImportedModelComponent(usedImportedModels)}
    
  const CompiledScene = () => {
    return (
      <div className="absolute inset-0">
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />
        <OrbitControls makeDefault />
        <Suspense fallback={null}>
          ${shapes.map((shape) => generateShapeJSX(shape)).join("\n        ")}
        </Suspense>
      </Canvas>
      </div>
    );
  };
  
  export default CompiledScene;`;

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
export const ExportButton = ({ shapes }) => {
  return (
    <button
      onClick={() => exportScene(shapes)}
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
