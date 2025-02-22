import { Canvas } from "@react-three/fiber";
import { GizmoHelper, OrbitControls, GizmoViewport } from "@react-three/drei";
import { useState } from "react";
import ShapeControls from "./ShapeControls";
import Grid from "./Grid";
import AnimationToolbar from "./AnimationToolbar";
import useAnimationControls from "../hooks/useAnimationControls";

const SceneRenderer = ({
  shapes,
  setShapes,
  selectedObject,
  setSelectedObject,
  background,
  isRotationEnabled,
}) => {
  const {
    animationStates,
    toggleAnimation,
    removeAnimation,
    getShapeAnimations,
  } = useAnimationControls();

  const handleApplyAnimation = (animation) => {
    if (selectedObject) {
      const animationType = animation.toLowerCase();
      toggleAnimation(selectedObject.id, animationType);
    }
  };

  const handleDeleteAnimation = (animation) => {
    if (selectedObject) {
      const animationType = animation.toLowerCase();
      removeAnimation(selectedObject.id, animationType);
    }
  };

  return (
    <div className="w-4/5 h-screen relative" style={{ background }}>
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
            onClick={() =>
              setSelectedObject(shapes.find((s) => s.id === shape.id))
            }
            isSelected={selectedObject?.id === shape.id}
            selectedObject={selectedObject}
            animationStates={animationStates}
          />
        ))}

        <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
          <GizmoViewport
            axisColors={["#9d4b4b", "#2f7f4f", "#3b5b9d"]}
            labelColor="white"
          />
        </GizmoHelper>
      </Canvas>

      {selectedObject && (
        <AnimationToolbar
          appliedAnimations={getShapeAnimations(selectedObject.id)}
          onApply={handleApplyAnimation}
          onDelete={handleDeleteAnimation}
        />
      )}
    </div>
  );
};

export default SceneRenderer;
