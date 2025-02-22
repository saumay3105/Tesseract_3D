import React from 'react';
import { Box, Cone } from '@react-three/drei';

export const Decorations = () => {
  return (
    <>
      {[[-3, 0, -3], [3, 0, 3], [-3, 0, 3], [3, 0, -3]].map((pos, idx) => (
        <Cone
          key={idx}
          position={pos}
          args={[0.5, 1, 8]}
        >
          <meshStandardMaterial color="#22c55e" />
        </Cone>
      ))}
      {[[-2, 0, 2], [2, 0, -2]].map((pos, idx) => (
        <Box
          key={idx}
          position={pos}
          args={[0.8, 0.8, 0.8]}
        >
          <meshStandardMaterial color="#fbbf24" />
        </Box>
      ))}
    </>
  );
};