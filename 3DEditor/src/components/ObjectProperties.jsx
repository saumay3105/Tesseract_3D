import { useState, useEffect } from "react";

const ObjectProperties = ({ selectedObject, updateObject, deleteShape }) => {
  const [position, setPosition] = useState({ x: 0, y: 0, z: 0 });
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (
      selectedObject &&
      Array.isArray(selectedObject.position) &&
      Array.isArray(selectedObject.rotation)
    ) {
      setPosition({
        x: selectedObject.position[0] || 0,
        y: selectedObject.position[1] || 0,
        z: selectedObject.position[2] || 0,
      });
      setRotation({
        x: (selectedObject.rotation[0] || 0) * (180 / Math.PI),
        y: (selectedObject.rotation[1] || 0) * (180 / Math.PI),
      });
      setScale(selectedObject.scale || 1);
    }
  }, [selectedObject]);

  const handlePositionChange = (axis, value) => {
    if (!updateObject || !selectedObject) return;
    const newPosition = { ...position, [axis]: parseFloat(value) };
    setPosition(newPosition);
    updateObject({
      position: [newPosition.x, newPosition.y, newPosition.z],
    });
  };

  const handleRotationChange = (axis, value) => {
    if (!updateObject || !selectedObject?.rotation) return;
    const degrees = parseFloat(value);
    setRotation((prev) => ({ ...prev, [axis]: degrees }));
    updateObject({
      rotation: [
        axis === "x"
          ? degrees * (Math.PI / 180)
          : selectedObject.rotation[0] || 0,
        axis === "y"
          ? degrees * (Math.PI / 180)
          : selectedObject.rotation[1] || 0,
        selectedObject.rotation[2] || 0,
      ],
    });
  };

  const handleScaleChange = (e) => {
    if (!updateObject) return;
    const newScale = parseFloat(e.target.value);
    setScale(newScale);
    updateObject({ scale: newScale });
  };

  if (!selectedObject) return null;

  return (
    <div className="absolute top-20 right-2 bg-gray-800 p-4 rounded-lg shadow-lg text-white w-64">
      <h3 className="text-sm font-semibold mb-4">Modify Object:</h3>

      <div className="flex items-center gap-2 mb-4">
        <label className="text-xs">Color:</label>
        <input
          type="color"
          value={selectedObject.color || "#ffffff"}
          onChange={(e) => updateObject?.({ color: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-2 mb-4">
        <label className="text-xs">Scale:</label>
        <input
          type="range"
          min="0.5"
          max="3"
          step="0.1"
          value={scale}
          onChange={handleScaleChange}
          className="w-full"
        />
      </div>

      <div className="flex flex-col gap-2 mb-4">
        <label className="text-xs">Position:</label>
        {["x", "y", "z"].map((axis) => (
          <div key={axis} className="flex flex-col gap-1">
            <label className="text-xs">{axis.toUpperCase()}:</label>
            <input
              type="range"
              min="-5"
              max="5"
              step="0.1"
              value={position[axis]}
              onChange={(e) => handlePositionChange(axis, e.target.value)}
              className="w-full"
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2 mb-4">
        <label className="text-xs">Rotation:</label>
        {["x", "y"].map((axis) => (
          <div key={axis} className="flex flex-col gap-1">
            <label className="text-xs">{axis.toUpperCase()}-axis:</label>
            <input
              type="range"
              min="0"
              max="360"
              step="1"
              value={rotation[axis]}
              onChange={(e) => handleRotationChange(axis, e.target.value)}
              className="w-full"
            />
          </div>
        ))}
      </div>

      <button
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded w-full"
        onClick={() => deleteShape?.()}
      >
        Delete
      </button>
    </div>
  );
};

export default ObjectProperties;
