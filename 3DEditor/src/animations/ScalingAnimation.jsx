import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

const ScalingAnimation = ({ speed = 0.02, scaleFactor = 1.5, children }) => {
  const ref = useRef();

  useFrame(({ clock }) => {
    if (ref.current) {
      const scale = 1 + Math.sin(clock.elapsedTime * speed) * (scaleFactor - 1);
      ref.current.scale.set(scale, scale, scale);
    }
  });

  return <group ref={ref}>{children}</group>;
};

export default ScalingAnimation;
