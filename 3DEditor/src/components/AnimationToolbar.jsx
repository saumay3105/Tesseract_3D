const AnimationToolbar = ({ appliedAnimations, onApply, onDelete }) => {
  const availableAnimations = [
    "Rotating",
    "Floating",
    "Pulsing",
    "Scaling",
    "Bouncing",
  ];

  return (
    <div className="absolute top-5 right-5 bg-gray-900 text-white p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-bold mb-2">Animations</h3>

      <div className="mb-4">
        <h4 className="text-sm font-semibold">Apply Animation:</h4>
        {availableAnimations.map((anim) => (
          <button
            key={anim}
            className={`px-3 py-1 m-1 rounded ${
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

      <div>
        <h4 className="text-sm font-semibold">Active Animations:</h4>
        {appliedAnimations.length > 0 ? (
          appliedAnimations.map((anim) => (
            <button
              key={anim}
              className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 m-1 rounded"
              onClick={() => onDelete(anim)}
            >
              {anim.charAt(0).toUpperCase() + anim.slice(1)} ✖
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
