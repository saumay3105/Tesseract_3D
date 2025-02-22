import { useEffect } from "react";

const useKeyboardShortcuts = ({
  deleteShape,
  undo,
  unselect,
  setIsRotationEnabled,
}) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === "z") {
        // Undo (Ctrl + Z)
        undo();
      } else if (event.key === "Delete" || event.key === "Backspace") {
        // Delete selected object
        deleteShape();
      } else if (event.key === "Escape") {
        // Unselect object
        unselect();
      } else if (event.altKey) {
        // Enable rotation
        setIsRotationEnabled(true);
      }
    };

    const handleKeyUp = (event) => {
      if (!event.altKey) {
        setIsRotationEnabled(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [deleteShape, undo, unselect, setIsRotationEnabled]);
};

export default useKeyboardShortcuts;
