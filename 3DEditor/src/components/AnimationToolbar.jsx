import React from "react";

const AnimationToolbar = ({ appliedAnimations, onApply, onDelete }) => {
  const availableAnimations = [
    "Rotating",
    "Floating",
    "Pulsing",
    "Scaling",
    "Bouncing",
  ];

  return (
    <div className="p-4">
      <h3 className="text-lg font-bold mb-4">Animations</h3>

      <div className="mb-6">
        <div className="grid grid-cols-2 gap-2">
          {availableAnimations.map((anim) => (
            <button
              key={anim}
              className={`px-3 py-2 rounded text-sm ${
                appliedAnimations.includes(anim.toLowerCase())
                  ? "bg-blue-700"
                  : "bg-blue-500 hover:bg-blue-700"
              }`}
              onClick={() => onApply(anim)}
            >
              {anim}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold mb-2">Active Animations:</h4>
        {appliedAnimations.length > 0 ? (
          <div className="grid grid-cols-2 gap-2">
            {appliedAnimations.map((anim) => (
              <button
                key={anim}
                className="bg-red-500 hover:bg-red-700 text-white px-3 py-2 rounded text-sm flex items-center justify-between"
                onClick={() => onDelete(anim)}
              >
                <span>{anim.charAt(0).toUpperCase() + anim.slice(1)}</span>
                <span>✖</span>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-xs">No animations applied.</p>
        )}
      </div>
    </div>
  );
};

export default AnimationToolbar;
