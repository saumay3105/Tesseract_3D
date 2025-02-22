import React, { useState } from "react";

const ObjectLibrary = ({ addShape }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const shapes = {
    basic: [
      { id: "cube", name: "Cube", icon: "⧈" },
      { id: "sphere", name: "Sphere", icon: "○" },
      { id: "cylinder", name: "Cylinder", icon: "⌭" },
      { id: "cone", name: "Cone", icon: "△" },
      { id: "torus", name: "Torus", icon: "◎" },
      { id: "pyramid", name: "Pyramid", icon: "△" },
    ],
    platonic: [
      { id: "tetrahedron", name: "Tetrahedron", icon: "△" },
      { id: "octahedron", name: "Octahedron", icon: "◇" },
      { id: "dodecahedron", name: "Dodecahedron", icon: "⬡" },
      { id: "icosahedron", name: "Icosahedron", icon: "◈" },
    ],
    geometric: [
      { id: "prism", name: "Prism", icon: "⬢" },
      { id: "capsule", name: "Capsule", icon: "⬭" },
      { id: "tube", name: "Tube", icon: "⌽" },
    ],
    architectural: [
      { id: "arch", name: "Arch", icon: "⌓" },
      { id: "stairs", name: "Stairs", icon: "⌶" },
      { id: "wall", name: "Wall", icon: "▯" },
    ],
    furniture: [
      { id: "chair", name: "Chair", icon: "🪑" },
      { id: "table", name: "Table", icon: "🪟" },
      { id: "bed", name: "Bed", icon: "🛏" },
      { id: "cabinet", name: "Cabinet", icon: "🗄" },
    ],
    vehicles: [
      { id: "car", name: "Car", icon: "🚗" },
      { id: "bus", name: "Bus", icon: "🚌" },
      { id: "motorcycle", name: "Motorcycle", icon: "🏍" },
      { id: "airplane", name: "Airplane", icon: "✈" },
    ],
    household: [
      { id: "book", name: "Book", icon: "📖" },
      { id: "bottle", name: "Bottle", icon: "🍶" },
      { id: "plate", name: "Plate", icon: "🍽" },
    ],
    characters: [
      { id: "man", name: "Man", icon: "👨" },
      { id: "woman", name: "Woman", icon: "👩" },
      { id: "dog", name: "Dog", icon: "🐕" },
    ],
    electronics: [
      { id: "phone", name: "Phone", icon: "📱" },
      { id: "computer", name: "Computer", icon: "💻" },
      { id: "tv", name: "TV", icon: "📺" },
    ],
  };

  return (
   
        <div className="mt-2 bg-gray-900 rounded p-2 max-h-96 ">
          {Object.entries(shapes).map(([category, items]) => (
            <div key={category} className="mb-4">
              <h3 className="text-sm font-semibold capitalize mb-2 text-white 400">
                {category}
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {items.map((shape) => (
                  <button
                    key={shape.id}
                    onClick={() => addShape(shape.id)}
                    className="flex flex-col items-center justify-center p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors duration-200"
                  >
                    <span className="text-2xl mb-1">{shape.icon}</span>
                    <div className="relative group w-full">
                      <span className="text-xs truncate max-w-[80px] block">
                        {shape.name}
                      </span>
                      <div className="absolute left-1/2 -translate-x-1/2 -top-6 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                        {shape.name}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
  );
};

export default ObjectLibrary;
