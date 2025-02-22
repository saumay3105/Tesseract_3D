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
  const { animations, addAnimation, removeAnimation } = useAnimationControls();

  const handleShapeClick = (id) => {
    setSelectedObject(shapes.find((s) => s.id === id));
  };

  const handleApplyAnimation = (animation) => {
    if (selectedObject) {
      addAnimation(selectedObject.id, animation);
    }
  };

  const handleDeleteAnimation = (animationId) => {
    if (selectedObject) {
      removeAnimation(selectedObject.id, animationId);
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
            onClick={() => handleShapeClick(shape.id)}
            isSelected={selectedObject?.id === shape.id}
            animations={animations?.[shape.id] || []} // ✅ Pass applied animations
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
          appliedAnimations={animations?.[selectedObject.id] || []}
          onApply={handleApplyAnimation}
          onDelete={handleDeleteAnimation}
        />
      )}
    </div>
  );
};

export default SceneRenderer;
