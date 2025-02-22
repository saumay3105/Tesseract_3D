import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

const FloatingAnimation = ({ speed = 1, amplitude = 0.2, children }) => {
  const ref = useRef();

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y += Math.sin(clock.elapsedTime * speed) * amplitude;
    }
  });

  return <group ref={ref}>{children}</group>;
};

export default FloatingAnimation;
