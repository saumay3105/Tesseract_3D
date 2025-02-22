import React from "react";

const availableAnimations = [
  "Bouncing",
  "Floating",
  "Pulsing",
  "Rotation",
  "Scaling",
];

const AnimationToolbar = ({ appliedAnimations, onApply, onDelete }) => {
  return (
    <div className="absolute top-5 right-5 bg-gray-900 text-white p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-bold mb-2">Animations</h3>
      
      {/* Apply Animation */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold">Apply Animation:</h4>
        {availableAnimations.map((anim) => (
          <button
            key={anim}
            className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 m-1 rounded"
            onClick={() => onApply(anim)}
          >
            {anim}
          </button>
        ))}
      </div>

      {/* Delete Animation */}
      <div>
        <h4 className="text-sm font-semibold">Remove Animation:</h4>
        {appliedAnimations.length > 0 ? (
          appliedAnimations.map((anim, index) => (
            <button
              key={index}
              className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 m-1 rounded"
              onClick={() => onDelete(anim)}
            >
              {anim} ✖
            </button>
          ))
        ) : (
          <p className="text-gray-400 text-xs">No animations applied.</p>
        )}
      </div>
    </div>
  );
};

export default AnimationToolbar;
