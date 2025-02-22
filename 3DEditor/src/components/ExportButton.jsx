import { geometryDefinitions } from "./geometryDefinition";

// Function to analyze which geometries are used
const analyzeShapeUsage = (shapes) => {
  const usedGeometries = new Set();
  const basicShapes = new Set();

  shapes.forEach((shape) => {
    if (geometryDefinitions[shape.type]) {
      usedGeometries.add(shape.type);
    } else {
      basicShapes.add(shape.type);
    }
  });

  return { usedGeometries, basicShapes };
};

// Generate imports section
const generateImports = (usedGeometries, basicShapes) => {
  return `import React, { Suspense, useRef, useEffect } from 'react';
  import { Canvas } from '@react-three/fiber';
  import { OrbitControls } from '@react-three/drei';
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

// Helper function to generate JSX for each shape
const generateShapeJSX = (shape) => {
  const { position, rotation, scale, color, type } = shape;
  const pos = `[${position.join(", ")}]`;
  const rot = `[${rotation.join(", ")}]`;

  if (geometryDefinitions[type]) {
    return `<CustomGeometry
            type="${type}"
            position={${pos}}
            rotation={${rot}}
            scale={[${scale}, ${scale}, ${scale}]}>
            <meshStandardMaterial color="${color}" />
          </CustomGeometry>`;
  }

  const geometryArgs = {
    cube: "[1, 1, 1]",
    sphere: "[0.7, 32, 32]",
    cone: "[0.5, 1, 32]",
    cylinder: "[0.5, 0.5, 1, 32]",
    torus: "[0.5, 0.2, 16, 100]",
    plane: "[2, 2]",
    tetrahedron: "[0.8]",
    octahedron: "[0.8]",
    dodecahedron: "[0.8]",
    icosahedron: "[0.8]",
  };

  const geometryType = `${type}Geometry`;
  return `<mesh position={${pos}} rotation={${rot}} scale={[${scale}, ${scale}, ${scale}]}>
            <${geometryType} args={${geometryArgs[type] || "[1, 1, 1]"}} />
            <meshStandardMaterial color="${color}" />
          </mesh>`;
};

// Main export function
export const exportScene = (shapes) => {
  const { usedGeometries, basicShapes } = analyzeShapeUsage(shapes);

  const componentCode = `${generateImports(usedGeometries, basicShapes)}
  
  ${generateGeometryFunctions(usedGeometries)}
  ${generateCustomGeometryComponent(usedGeometries)}

  
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
