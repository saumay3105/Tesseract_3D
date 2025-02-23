import React, { useState, Suspense, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Text3D,
  Stars,
  Sky,
  Cloud,
  Environment,
} from "@react-three/drei";
import { useGLTF } from "@react-three/drei";
import { useTexture } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useLoader } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const ImportedModel = ({ shape }) => {
  const modelRef = useRef();
  const [isLoaded, setIsLoaded] = useState(false);

  // Cleanup function to dispose of resources
  const cleanupModel = () => {
    if (modelRef.current) {
      modelRef.current.traverse((child) => {
        if (child.isMesh) {
          child.geometry.dispose();
          child.material.dispose();
        }
      });
    }
  };

  // Handle model download
  const handleDownload = async () => {
    try {
      const response = await fetch(shape.downloadUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = shape.name || "model" + "." + shape.modelType;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading model:", error);
    }
  };

  // Effect to cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupModel();
    };
  }, []);

  // Effect to handle model loading
  useEffect(() => {
    setIsLoaded(false);
    const loadModel = async () => {
      try {
        let loadedModel;
        switch (shape.modelType) {
          case "glb":
          case "gltf":
            loadedModel = await new Promise((resolve, reject) => {
              const loader = new GLTFLoader();
              loader.load(
                shape.modelUrl,
                (gltf) => {
                  modelRef.current = gltf.scene;
                  resolve(gltf.scene);
                },
                undefined,
                reject
              );
            });
            break;
          // Add similar cases for other model types if needed
        }
        setIsLoaded(true);
      } catch (error) {
        console.error("Error loading model:", error);
      }
    };

    loadModel();
  }, [shape.modelUrl, shape.modelType]);

  if (!isLoaded) {
    return (
      <group>
        <meshBasicMaterial color="gray" />
      </group>
    );
  }

  try {
    switch (shape.modelType) {
      case "glb":
      case "gltf":
        return (
          <group>
            <primitive object={modelRef.current} />
            {shape.downloadUrl && (
              <Text3D
                position={[0, -1, 0]}
                fontSize={0.2}
                onClick={handleDownload}
                style={{ cursor: "pointer" }}
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
                style={{ cursor: "pointer" }}
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
                style={{ cursor: "pointer" }}
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
};

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
};

const Scene = () => {
  const [currentFrame, setCurrentFrame] = useState(0);

  return (
    <div
      className="absolute inset-0"
      style={{
        background: "transparent",
      }}
    >
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />
        <OrbitControls makeDefault />
        <ModelObject
          key={1740309737471}
          shape={{
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            color: "#888888",
            scale: 1,
            id: 1740309737471,
            type: "sphere",
            icon: "○",
          }}
          animationStates={{}}
          animationData={{
            0: { position: [0, 0, 0], rotation: [0, 0, 0], scale: 1 },
          }}
          setCurrentFrame={setCurrentFrame}
        >
          <mesh
            position={
              getInterpolatedValues(
                { 0: { position: [0, 0, 0], rotation: [0, 0, 0], scale: 1 } },
                currentFrame
              )?.position
            }
            rotation={[0, 0, 0]}
            scale={[1, 1, 1]}
          >
            <sphereGeometry />
            <meshStandardMaterial color="#888888" map={null} />
          </mesh>
        </ModelObject>
        <Sky sunPosition={[0, 1, 0]} />
      </Canvas>
    </div>
  );
};

export default Scene;
