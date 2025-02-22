import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

const PulsingAnimation = ({ speed = 0.1, intensity = 0.5, children }) => {
  const ref = useRef();

  useFrame(({ clock }) => {
    if (ref.current) {
      const scale = 1 + Math.sin(clock.elapsedTime * speed) * intensity;
      ref.current.scale.set(scale, scale, scale);
    }
  });

  return <group ref={ref}>{children}</group>;
};

export default PulsingAnimation;
