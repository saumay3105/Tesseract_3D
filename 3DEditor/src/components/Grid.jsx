import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

const Grid = () => {
  const gridRef = useRef();

  useFrame(() => {
    if (gridRef.current) {
      gridRef.current.position.y = -0.01; // Slightly below objects
    }
  });

  return (
    <gridHelper
      ref={gridRef}
      args={[20, 40, "#444444", "#222222"]} // Bigger and denser grid
      position={[0, -0.01, 0]}
    />
  );
};

export default Grid;
