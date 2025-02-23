import React, { useState } from 'react';
import { Copy, CheckCircle2, X } from 'lucide-react';
import { geometryDefinitions } from "./geometryDefinition";
import modelConfigs from "./modelConfigs.json";

// Export Popup Component
const ExportPopup = ({ isOpen, onClose, onExport }) => {
  const [copied, setCopied] = useState(false);
  const [exported, setExported] = useState(false);

  if (!isOpen) return null;

  const installCommand = `npm install @react-three/fiber @react-three/drei three`;

  const handleCopy = () => {
    navigator.clipboard.writeText(installCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    onExport();
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  };

  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-[#1e2127] rounded-lg w-full max-w-md p-6 relative text-gray-200">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-200"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-white">Export Scene</h2>
        <p className="text-gray-400 mb-6">
          Follow these steps to use your exported scene in your React project
        </p>

        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-2 text-white">1. Install Required Dependencies</h3>
            <div className="flex items-center gap-2 bg-[#282c34] p-3 rounded-md">
              <code className="text-sm flex-1 text-gray-300">{installCommand}</code>
              <button
                onClick={handleCopy}
                className="p-2 hover:bg-[#363b44] rounded-md transition-colors"
              >
                {copied ? 
                  <CheckCircle2 className="w-4 h-4 text-green-500" /> : 
                  <Copy className="w-4 h-4 text-gray-400" />
                }
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2 text-white">2. Export Scene File</h3>
            <button
              onClick={handleExport}
              className="w-full bg-[#6069fa] text-white py-2 px-4 rounded-md hover:bg-[#4c56f8] transition-colors"
            >
              {exported ? 'Exported!' : 'Export CompiledScene.jsx'}
            </button>
          </div>

          <div>
            <h3 className="font-medium mb-2 text-white">3. Usage Instructions</h3>
            <div className="bg-[#282c34] p-4 rounded-md">
              <p className="text-sm text-gray-400 mb-2">
                Import and use the scene component in your React application:
              </p>
              <pre className="bg-[#1e2127] p-3 rounded-md text-sm text-gray-300">
                {`import Scene from './CompiledScene';\n\nfunction App() {\n  return <Scene />;\n}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
  import { OrbitControls, Text3D } from '@react-three/drei';
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

// Generate the CustomGeometry component
const generateCustomGeometryComponent = (usedGeometries) => {
  if (usedGeometries.size === 0) return "";

  const geometrySwitch = Array.from(usedGeometries)
    .map(
      (type) => `      case '${type}':
          geometry = create${type.charAt(0).toUpperCase() + type.slice(1)}Geometry();
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

// Generate imported model component
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

// Helper function to generate JSX for each shape
const generateShapeJSX = (shape) => {
  const { position, rotation, scale, color, type, texturePath, text, height } =
    shape;
  const pos = `[${position.join(", ")}]`;
  const rot = `[${rotation.join(", ")}]`;

  const isModelType = modelConfigs[type];
  const texture = texturePath ? `useTexture('${texturePath}')` : "null";

  let jsx = `<mesh position={${pos}} rotation={${rot}} scale={[${scale}, ${scale}, ${scale}]}>`;

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

  if (type === "ThreeDText") {
    return `${jsx}
            <Text3D
              font="/fonts/helvetiker_regular.typeface.json"
              size={${scale}}
              height={${height || 0.2}}
              curveSegments={12}
              bevelEnabled={true}
              bevelThickness={0.01}
              bevelSize={0.02}
              bevelOffset={0}
              bevelSegments={5}
            >
              ${text}
              <meshStandardMaterial color="${color}" />
            </Text3D>
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
          }) => {
            const meshRef = useRef();
            const [offset] = useState(Math.random() * Math.PI * 2);
            const initialPosition = shape.position;
            
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

const addModel = (shape, animationStates) => {
  return `<ModelObject
              key={${shape.id}}
              shape={${JSON.stringify(shape)}}
              animationStates={${JSON.stringify(animationStates)}}
            >
            ${generateShapeJSX(shape)}
            </ModelObject>`;
};

// Main export function
const exportScene = (shapes, animationStates) => {
  const { usedGeometries, usedModels, usedImportedModels, basicShapes } =
    analyzeShapeUsage(shapes);

  const componentCode = `${generateImports()}
    
  ${generateGeometryFunctions(usedGeometries)}
  ${generateCustomGeometryComponent(usedGeometries)}
  ${generateModelComponent(usedModels)}
  ${generateImportedModelComponent(usedImportedModels)}
  ${generateModelObject()}

    
  const Scene = () => {
    return (
      <div className="absolute inset-0">
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />
        <OrbitControls makeDefault />
          ${shapes.map((shape) => addModel(shape, animationStates))}
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
export const ExportButton = ({ shapes, animationStates }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleExport = () => {
    exportScene(shapes, animationStates);
  };

  return (
    <>
      <button
        onClick={() => setIsPopupOpen(true)}
        className="px-5 py-2.5 bg-[#6069fa] text-white rounded-md hover:bg-[#4c56f8] transition-colors font-medium"
      >
        Export Scene
      </button>
      
      <ExportPopup 
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onExport={handleExport}
      />
    </>
  );
};