import { Eye, EyeOff, Trash2 } from "lucide-react";

const SceneObjects = ({
  shapes = [],
  setShapes,
  selectedObject,
  setSelectedObject,
}) => {
  const toggleVisibility = (id, event) => {
    event.stopPropagation();
    if (!shapes || !setShapes) return;
    setShapes(
      shapes.map((shape) =>
        shape.id === id ? { ...shape, isHidden: !shape.isHidden } : shape
      )
    );
  };

  const deleteObject = (id, event) => {
    event.stopPropagation();
    if (!shapes || !setShapes) return;
    setShapes(shapes.filter((shape) => shape.id !== id));
    if (selectedObject?.id === id) {
      setSelectedObject(null);
    }
  };

  const handleSelection = (shape) => {
    if (!setSelectedObject) return;
    setSelectedObject(selectedObject?.id === shape.id ? null : shape);
  };

  if (!Array.isArray(shapes) || shapes.length === 0) {
    return (
      <div className="mt-4">
        <h3 className="text-sm font-semibold mb-2">Scene Objects</h3>
        <div className="text-gray-500 text-sm text-center p-2 bg-gray-800 rounded">
          No objects in scene
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h3 className="text-sm font-semibold mb-2">Scene Objects</h3>
      <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 bg-gray-800 rounded">
        {shapes.map((shape) => (
          <div
            key={shape.id}
            className={`flex flex-col items-center p-2 rounded cursor-pointer transition-colors duration-200 ${
              selectedObject?.id === shape.id
                ? "bg-blue-600"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
            onClick={() => handleSelection(shape)}
          >
            <div className="flex items-center justify-between w-full mb-1">
              <span className="text-lg mr-2">{shape.icon || "⬡"}</span>
              <span className="text-xs capitalize truncate flex-1">
                {shape.type}
              </span>
            </div>
            <div className="flex items-center gap-2 w-full justify-end">
              <button
                className="p-1 hover:bg-gray-500 rounded transition-colors duration-200"
                onClick={(e) => toggleVisibility(shape.id, e)}
                title={shape.isHidden ? "Show" : "Hide"}
              >
                {shape.isHidden ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
              <button
                className="p-1 hover:bg-gray-500 rounded transition-colors duration-200 text-red-400"
                onClick={(e) => deleteObject(shape.id, e)}
                title="Delete"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SceneObjects;
