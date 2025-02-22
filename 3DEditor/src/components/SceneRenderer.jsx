import { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { GizmoHelper, OrbitControls, GizmoViewport } from "@react-three/drei";
import { useState } from "react";
import ShapeControls from "./ShapeControls";
import Timeline from "./Timeline";
import Grid from "./Grid";

const SceneRenderer = ({
  shapes,
  setShapes,
  selectedObject,
  setSelectedObject,
  background,
  isRotationEnabled,
  updateObject,
  currentFrame,
  setCurrentFrame,
  animationData,
  animationStates,
}) => {
  const [keyframes, setKeyframes] = useState({});

  useEffect(() => {
    setKeyframes(animationData[selectedObject?.id] || {});
  }, [selectedObject, animationData]);

  return (
    <div className="w-[78vw] h-screen flex flex-col" style={{ background }}>
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />
        <OrbitControls enableRotate={isRotationEnabled} makeDefault />
        <Grid />

        {shapes.map((shape) => (
          <ShapeControls
            key={shape.id}
            shape={shape}
            setShapes={setShapes}
            updateObject={updateObject}
            onClick={() =>
              setSelectedObject(shapes.find((s) => s.id === shape.id))
            }
            isSelected={selectedObject?.id === shape.id}
            selectedObject={selectedObject}
            animationStates={animationStates}
            shapeAnimationData={animationData[shape.id]}
            currentFrame={currentFrame}
          />
        ))}

        <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
          <GizmoViewport
            axisColors={["#9d4b4b", "#2f7f4f", "#3b5b9d"]}
            labelColor="white"
          />
        </GizmoHelper>
      </Canvas>

      <Timeline
        currentFrame={currentFrame}
        setCurrentFrame={setCurrentFrame}
        keyframes={keyframes}
      />
    </div>
  );
};

export default SceneRenderer;
