import { useState } from "react";
import Sidebar from "../Sidebar";
import SceneRenderer from "../SceneRenderer";
import useKeyboardShortcuts from "../../hooks/useKeyboardShortcuts";
import ObjectProperties from "../ObjectProperties";
import useAnimationControls from "../../hooks/useAnimationControls";

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
  const {
    animationStates,
    toggleAnimation,
    removeAnimation,
    getShapeAnimations,
  } = useAnimationControls();
  const [shapes, setShapes] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedObject, setSelectedObject] = useState(null);
  const [background, setBackground] = useState("#111111");
  const [isRotationEnabled, setIsRotationEnabled] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [animationData, setAnimationData] = useState({});

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
      // Initialize animation data for the new shape
      setAnimationData((prev) => ({
        ...prev,
        [newShape.id]: {
          0: {
            position: [...newShape.position],
            rotation: [...newShape.rotation],
            scale: newShape.scale,
          },
        },
      }));
      setHistory([...history, shapes]);
      setShapes([...shapes, newShape]);
    } else {
      // Handle imported models
      setHistory([...history, shapes]);
      setShapes([...shapes, shapeData]);
    }
  };

  const updateObject = (updates) => {
    if (!selectedObject) return;

    // Update the current frame's animation data
    setAnimationData((prev) => ({
      ...prev,
      [selectedObject.id]: {
        ...prev[selectedObject.id],
        [currentFrame]: {
          position:
            updates.position ||
            prev[selectedObject.id]?.[currentFrame]?.position,
          rotation:
            updates.rotation ||
            prev[selectedObject.id]?.[currentFrame]?.rotation,
          scale:
            updates.scale || prev[selectedObject.id]?.[currentFrame]?.scale,
        },
      },
    }));

    // Update the current shape state
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
      // Remove animation data for the deleted shape
      setAnimationData((prev) => {
        const newData = { ...prev };
        delete newData[selectedObject.id];
        return newData;
      });

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
          shapes={shapes}
          setShapes={setShapes}
          addShape={addShape}
          selectedObject={selectedObject}
          setSelectedObject={setSelectedObject}
          updateObject={updateObject}
          setBackground={setBackground}
          animationStates={animationStates}
          toggleAnimation={toggleAnimation}
          removeAnimation={removeAnimation}
          getShapeAnimations={getShapeAnimations}
        />
        <SceneRenderer
          shapes={shapes}
          setShapes={setShapes}
          selectedObject={selectedObject}
          setSelectedObject={setSelectedObject}
          background={background}
          isRotationEnabled={isRotationEnabled}
          currentFrame={currentFrame}
          setCurrentFrame={setCurrentFrame}
          updateObject={updateObject}
          animationData={animationData}
          animationStates={animationStates}
        />
        <ObjectProperties
          selectedObject={selectedObject}
          updateObject={updateObject}
          deleteShape={deleteShape}
          undo={undo}
          unselect={unselect}
        />
      </div>
    </div>
  );
};

export default Playground;
