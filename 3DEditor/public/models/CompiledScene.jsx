import React, { useState, Suspense, useRef, useEffect } from 'react';
  import { Canvas } from '@react-three/fiber';
  import { OrbitControls, Text3D } from '@react-three/drei';
  import { useGLTF } from "@react-three/drei";
  import { useTexture } from "@react-three/drei";
  import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
  import { useLoader } from "@react-three/fiber";
  import { useFrame } from "@react-three/fiber";
  import * as THREE from 'three';
    
  
  
  
  const ImportedModel = ({ shape }) => {
    const handleDownload = async () => {
      try {
        const response = await fetch(shape.downloadUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        console.log("url" + url);
        link.href = url;
        link.download = shape.name || 'model' + '.' + shape.modelType;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error downloading model:", error);
      }
    };

    try {
      switch (shape.modelType) {
        case "glb":
        case "gltf":
          const model = useLoader(GLTFLoader, shape.modelUrl);
          return (
            <group>
              <primitive object={model.scene} />
              {shape.downloadUrl && (
                <Text3D
                  position={[0, -1, 0]}
                  fontSize={0.2}
                  onClick={handleDownload}
                  style={{ cursor: 'pointer' }}
                >
                  Download Model
                  <meshStandardMaterial color="white" />
                </Text3D>
              )}
            </group>
          );
        case "obj":
          const objModel = useLoader(OBJLoader, shape.modelUrl);
          return (
            <group>
              <primitive object={objModel} />
              {shape.downloadUrl && (
                <Text3D
                  position={[0, -1, 0]}
                  fontSize={0.2}
                  onClick={handleDownload}
                  style={{ cursor: 'pointer' }}
                >
                  Download Model
                  <meshStandardMaterial color="white" />
                </Text3D>
              )}
            </group>
          );
        case "stl":
          const geometry = useLoader(STLLoader, shape.modelUrl);
          return (
            <group>
              <mesh geometry={geometry}>
                <meshStandardMaterial color={shape.color} />
              </mesh>
              {shape.downloadUrl && (
                <Text3D
                  position={[0, -1, 0]}
                  fontSize={0.2}
                  onClick={handleDownload}
                  style={{ cursor: 'pointer' }}
                >
                  Download Model
                  <meshStandardMaterial color="white" />
                </Text3D>
              )}
            </group>
          );
        default:
          return null;
      }
    } catch (error) {
      console.error("Error loading model:", error);
      return null;
    }
  };
  const ModelObject = ({
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
          };

    
  const Scene = () => {
    return (
      <div className="absolute inset-0">
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />
        <OrbitControls makeDefault />
          <ModelObject
              key={1740310921548}
              shape={{"position":[0,0,0],"rotation":[0,0,0],"color":"#888888","scale":1,"id":1740310921548,"type":"importedModel","modelUrl":"http://localhost:3000/download/1740310921529-925384581.glb","modelType":"glb","name":"dog.glb"}}
              animationStates={{}}
            >
            <ImportedModel shape={{"position":[0,0,0],"rotation":[0,0,0],"color":"#888888","scale":1,"id":1740310921548,"type":"importedModel","modelUrl":"http://localhost:3000/download/1740310921529-925384581.glb","modelType":"glb","name":"dog.glb"}} />
            </ModelObject>
      </Canvas>
      </div>
    );
  };
  
  export default Scene;