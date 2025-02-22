import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ObjectLibrary from "./ObjectLibrary";
import SceneObjects from "./SceneObjects";
import ModelImporter from "./ModelImporter";

const Sidebar = ({
  addShape,
  shapes = [],
  setShapes,
  selectedObject,
  setSelectedObject,
  updateObject,
  deleteShape,
  setBackground,
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0, z: 0 });
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [animation, setAnimation] = useState("");

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
      setAnimation(selectedObject.animation || "");
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

  return (
    <div className="w-1/5 h-screen bg-gray-900 text-white p-4 flex flex-col gap-4 overflow-y-auto">
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 bg-blue-500 p-2 rounded hover:bg-blue-600"
        >
          <ArrowLeft size={18} /> Home
        </Link>
        <h2 className="text-xl font-bold">Tesseract</h2>
      </div>

      <ObjectLibrary addShape={addShape} />
      <ModelImporter addShape={addShape}/>

      <SceneObjects
        shapes={shapes}
        setShapes={setShapes}
        selectedObject={selectedObject}
        setSelectedObject={setSelectedObject}
      />

      {selectedObject && (
        <>
          <h3 className="mt-4 text-sm font-semibold">Modify Object:</h3>

          <div className="flex items-center gap-2">
            <label className="text-xs">Color:</label>
            <input
              type="color"
              value={selectedObject.color || "#ffffff"}
              onChange={(e) => updateObject?.({ color: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-2 mt-2 w-full">
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

          <div className="flex flex-col gap-2 mt-2 w-full">
            <label className="text-xs">Position:</label>
            {["x", "y", "z"].map((axis) => (
              <div key={axis} className="flex flex-col gap-1 w-full">
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

          <div className="flex flex-col gap-2 mt-2 w-full">
            <label className="text-xs">Rotation:</label>
            {["x", "y"].map((axis) => (
              <div key={axis} className="flex flex-col gap-1 w-full">
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
            className="bg-red-500 p-2 mt-4 rounded hover:bg-red-600"
            onClick={() => deleteShape?.()}
          >
            Delete
          </button>
        </>
      )}
    </div>
  );
};

export default Sidebar;
