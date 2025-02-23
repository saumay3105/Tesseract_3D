import React, { useState, useEffect } from "react";

const DraggableInput = ({
  defaultValue = 1,
  onChange = () => {},
  className = "",
  value = defaultValue,
  setValue = null,
  scaleFactor = 0.05,
}) => {
  // Ensure setValue is available
  const [localValue, setLocalValue] = useState(defaultValue);
  const controlledValue = setValue ? value : localValue;
  const setControlledValue = setValue || setLocalValue;

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startValue, setStartValue] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setStartValue(parseFloat(controlledValue) || defaultValue);
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;

      const dx = e.clientX - startX;
      let newValue = startValue + dx * scaleFactor;
      newValue = Math.round(newValue * 100) / 100;

      setControlledValue(newValue);
      onChange(newValue);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, startX, startValue, scaleFactor, onChange]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setControlledValue(newValue);
    if (!isNaN(parseFloat(newValue))) {
      onChange(parseFloat(newValue));
    }
  };

  return (
    <div className="relative flex items-center">
      <input
        value={controlledValue}
        onChange={handleInputChange}
        className={`w-full px-2 py-1 bg-gray-700 cursor-col-resize rounded text-white text-sm ${className}`}
        onMouseDown={handleMouseDown}
      />
    </div>
  );
};

export default DraggableInput;
