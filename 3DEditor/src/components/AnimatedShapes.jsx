import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import ShapeControls from "./ShapeControls";

const AnimatedShapes = ({
  shapes,
  setShapes,
  selectedObject,
  setSelectedObject,
  animationStates,
}) => {
  const shapeRefs = useRef({});

  const handleShapeClick = (id) => {
    setSelectedObject(shapes.find((s) => s.id === id));
  };

  // Apply animations inside the useFrame hook
  useFrame(() => {
    Object.keys(shapeRefs.current).forEach((id) => {
      const ref = shapeRefs.current[id];
      if (ref) {
        if (animationStates.isRotating) {
          ref.rotation.y += 0.02; // Rotation Animation
        }
        if (animationStates.isFloating) {
          ref.position.y = Math.sin(Date.now() * 0.002) * 0.5; // Floating Animation
        }
        if (animationStates.isScaling) {
          const scaleFactor = 1 + 0.1 * Math.sin(Date.now() * 0.005);
          ref.scale.set(scaleFactor, scaleFactor, scaleFactor); // Scaling Animation
        }
        if (animationStates.isPulsing) {
          const pulseFactor = 1 + 0.05 * Math.sin(Date.now() * 0.01);
          ref.scale.set(pulseFactor, pulseFactor, pulseFactor); // Pulsing Animation
        }
        if (animationStates.isBouncing) {
          ref.position.y = Math.abs(Math.sin(Date.now() * 0.005)) * 1.5; // Bouncing Animation
        }
      }
    });
  });

  return (
    <>
      {shapes.map((shape) => (
        <ShapeControls
          key={shape.id}
          shape={shape}
          setShapes={setShapes}
          onClick={() => handleShapeClick(shape.id)}
          isSelected={selectedObject?.id === shape.id}
          ref={(el) => (shapeRefs.current[shape.id] = el)}
        />
      ))}
    </>
  );
};

export default AnimatedShapes;
