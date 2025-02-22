import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

const BouncingAnimation = ({ speed = 2, height = 0.3, children }) => {
  const ref = useRef();

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = Math.abs(Math.sin(clock.elapsedTime * speed)) * height;
    }
  });

  return <group ref={ref}>{children}</group>;
};

export default BouncingAnimation;
