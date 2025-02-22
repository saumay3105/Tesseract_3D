import { useState } from "react";

const useAnimationControls = () => {
  const [animationStates, setAnimationStates] = useState({});

  const toggleAnimation = (shapeId, animationType) => {
    setAnimationStates(prev => ({
      ...prev,
      [shapeId]: {
        ...prev[shapeId],
        [animationType]: !prev[shapeId]?.[animationType]
      }
    }));
  };

  const removeAnimation = (shapeId, animationType) => {
    setAnimationStates(prev => ({
      ...prev,
      [shapeId]: {
        ...prev[shapeId],
        [animationType]: false
      }
    }));
  };

  const getShapeAnimations = (shapeId) => {
    return Object.entries(animationStates[shapeId] || {})
      .filter(([_, isActive]) => isActive)
      .map(([type]) => type);
  };

  return {
    animationStates,
    toggleAnimation,
    removeAnimation,
    getShapeAnimations
  };
};

export default useAnimationControls;