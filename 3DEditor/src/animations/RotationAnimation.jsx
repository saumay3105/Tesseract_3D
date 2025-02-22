import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

const RotationAnimation = ({ speed = 0.01, children }) => {
  const ref = useRef();

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += speed;
    }
  });

  return <group ref={ref}>{children}</group>;
};

export default RotationAnimation;
