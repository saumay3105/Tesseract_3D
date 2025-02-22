import { useState } from "react";
import Sidebar from "../Sidebar";
import SceneRenderer from "../SceneRenderer";
import Toolbar from "../Toolbar";
import useKeyboardShortcuts from "../../hooks/useKeyboardShortcuts";

const shapeLibrary = {
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

const Playground = () => {
  const [shapes, setShapes] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedObject, setSelectedObject] = useState(null);
  const [background, setBackground] = useState("#111111");
  const [isRotationEnabled, setIsRotationEnabled] = useState(false);

  const findShapeIcon = (shapeType) => {
    for (const category of Object.values(shapeLibrary)) {
      const shape = category.find((item) => item.id === shapeType);
      if (shape) return shape.icon;
    }
    return "⬡";
  };

  const addShape = (shapeData) => {
    if (typeof shapeData === "string") {
      // Existing basic shapes handling
      const newShape = {
        id: Date.now(),
        type: shapeData,
        icon: findShapeIcon(shapeData),
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        color: "#888888",
        scale: 1,
      };
      setHistory([...history, shapes]);
      setShapes([...shapes, newShape]);
    } else {
      // Handle imported models
      setHistory([...history, shapes]);
      setShapes([...shapes, shapeData]);
    }
  };
  const updateObject = (updates) => {
    setShapes(
      shapes.map((shape) =>
        shape.id === selectedObject.id ? { ...shape, ...updates } : shape
      )
    );
  };

  const deleteShape = () => {
    if (selectedObject) {
      if (selectedObject.modelUrl) {
        URL.revokeObjectURL(selectedObject.modelUrl);
      }
      setShapes(shapes.filter((shape) => shape.id !== selectedObject.id));
      setSelectedObject(null);
    }
  };

  const undo = () => {
    if (history.length > 0) {
      setShapes(history[history.length - 1]);
      setHistory(history.slice(0, -1));
    }
  };

  const unselect = () => {
    setSelectedObject(null);
  };

  useKeyboardShortcuts({ deleteShape, undo, unselect, setIsRotationEnabled });

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1">
        <Sidebar
          addShape={addShape}
          shapes={shapes}
          setShapes={setShapes}
          selectedObject={selectedObject}
          setSelectedObject={setSelectedObject}
          updateObject={updateObject}
          deleteShape={deleteShape}
          setBackground={setBackground}
        />
        <SceneRenderer
          shapes={shapes}
          setShapes={setShapes}
          selectedObject={selectedObject}
          setSelectedObject={setSelectedObject}
          background={background}
          isRotationEnabled={isRotationEnabled}
        />
        <Toolbar undo={undo} unselect={unselect} />
      </div>
    </div>
  );
};

export default Playground;
