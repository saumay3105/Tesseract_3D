import React, { useState } from "react";
import { Text3D } from "@react-three/drei";
import { ChromePicker } from "react-color";
import { AlertCircle } from "lucide-react";

const TextCreator = ({ addShape }) => {
  const [text, setText] = useState("");
  const [color, setColor] = useState("#ffffff");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [size, setSize] = useState(1);
  const [height, setHeight] = useState(0.2);

  const handleCreateText = () => {
    if (!text.trim()) return;

    addShape({
      type: "ThreeDText",
      text: text.trim(),
      color: color,
      scale: size,
      height: height,
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      icon: "📝",
    });

    // Reset form
    setText("");
  };

  return (
    <div className="flex flex-col gap-4 p-2">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Text</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text..."
          className="bg-gray-800 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Color</label>
        <div className="relative">
          <button
            className="w-full h-8 rounded flex items-center px-2 gap-2"
            style={{ backgroundColor: color }}
            onClick={() => setShowColorPicker(!showColorPicker)}
          >
            <span
              className="text-xs"
              style={{ color: color === "#ffffff" ? "#000000" : "#ffffff" }}
            >
              {color}
            </span>
          </button>
          {showColorPicker && (
            <div className="absolute z-10 mt-2">
              <div
                className="fixed inset-0"
                onClick={() => setShowColorPicker(false)}
              />
              <ChromePicker
                color={color}
                onChange={(color) => setColor(color.hex)}
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Size</label>
        <input
          type="range"
          min="0.1"
          max="3"
          step="0.1"
          value={size}
          onChange={(e) => setSize(parseFloat(e.target.value))}
          className="w-full"
        />
        <span className="text-xs text-gray-400">{size}</span>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Depth</label>
        <input
          type="range"
          min="0.1"
          max="2"
          step="0.1"
          value={height}
          onChange={(e) => setHeight(parseFloat(e.target.value))}
          className="w-full"
        />
        <span className="text-xs text-gray-400">{height}</span>
      </div>

      <button
        onClick={handleCreateText}
        disabled={!text.trim()}
        className={`w-full py-2 rounded font-medium ${
          text.trim()
            ? "bg-blue-500 hover:bg-blue-600"
            : "bg-gray-700 cursor-not-allowed"
        }`}
      >
        Add 3D Text
      </button>
    </div>
  );
};

export default TextCreator;
