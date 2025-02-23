import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Library, Import, Play, Type } from "lucide-react";
import ObjectLibrary from "./ObjectLibrary";
import SceneObjects from "./SceneObjects";
import ModelImporter from "./ModelImporter";
import AnimationToolbar from "./AnimationToolbar";
import TextCreator from "./TextCreator";

const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 w-full p-4 pl-2 justify-center text-xs font-medium transition-colors duration-200 border-l-4 ${
      active
        ? "bg-gray-800 border-blue-500 text-white"
        : "border-transparent text-gray-400 hover:text-white hover:bg-gray-800"
    }`}
  >
    {children}
  </button>
);

const Sidebar = ({
  addShape,
  shapes = [],
  setShapes,
  selectedObject,
  setSelectedObject,
  updateObject,
  deleteShape,
  setBackground,
  animationStates,
  toggleAnimation,
  removeAnimation,
  getShapeAnimations,
}) => {
  const [activeTab, setActiveTab] = useState("library");

  const handleApplyAnimation = (animation) => {
    if (selectedObject) {
      const animationType = animation.toLowerCase();
      toggleAnimation(selectedObject.id, animationType);
    }
  };

  const handleDeleteAnimation = (animation) => {
    if (selectedObject) {
      const animationType = animation.toLowerCase();
      removeAnimation(selectedObject.id, animationType);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "library":
        return <ObjectLibrary addShape={addShape} />;
      case "import":
        return <ModelImporter addShape={addShape} />;
      case "text":
        return <TextCreator addShape={addShape} />;
      case "animations":
        return selectedObject ? (
          <AnimationToolbar
            appliedAnimations={getShapeAnimations(selectedObject.id)}
            onApply={handleApplyAnimation}
            onDelete={handleDeleteAnimation}
          />
        ) : (
          <div className="p-4 text-gray-400">
            Select an object to apply animations
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-[22vw] h-screen bg-gray-900 text-white flex">
      <div className="w-16 bg-gray-900 border-r border-none flex flex-col">
        <div className="p-3 border-none">
          <Link
            to="/"
            className="flex items-center justify-center bg-blue-500 p-2 rounded hover:bg-blue-600"
          >
            <ArrowLeft size={18} />
          </Link>
        </div>
        <TabButton
          active={activeTab === "library"}
          onClick={() => setActiveTab("library")}
        >
         Library
        </TabButton>
        <TabButton
          active={activeTab === "import"}
          onClick={() => setActiveTab("import")}
        >
          Import
        </TabButton>
        <TabButton
          active={activeTab === "animations"}
          onClick={() => setActiveTab("animations")}
        >
          Animate
        </TabButton>
        <TabButton
          active={activeTab === "text"}
          onClick={() => setActiveTab("text")}
        >
          Text
        </TabButton>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-none">
          <h2 className="text-xl font-bold">Playground</h2>
        </div>

        <div className="flex-1 overflow-y-auto border-b border-gray-800 p-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-900 [&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded">
          {renderTabContent()}
        </div>

        <div className="h-1/2 overflow-y-auto p-4">
          <SceneObjects
            shapes={shapes}
            setShapes={setShapes}
            selectedObject={selectedObject}
            setSelectedObject={setSelectedObject}
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
