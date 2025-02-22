import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';

const ModelImporter = ({ addShape }) => {
  const supportedFormats = ['.glb', '.gltf', '.obj', '.stl'];
  
  const handleFileChange = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;

    const extension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
    if (!supportedFormats.includes(extension)) {
      alert(`Unsupported file format. Please use: ${supportedFormats.join(', ')}`);
      return;
    }

    // Create a URL for the uploaded file
    const objectUrl = URL.createObjectURL(file);

    // Create a new shape with the imported model
    const newShape = {
      id: Date.now(),
      type: 'importedModel',
      modelUrl: objectUrl,
      modelType: extension.slice(1), // Remove the dot from extension
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: 1,
      color: "#888888",
      name: file.name
    };

    addShape(newShape);
  }, [addShape]);

  return (
    <div className="mt-4">
      <h3 className="text-sm font-semibold mb-2">Import Model</h3>
      <label className="flex flex-col items-center p-4 border-2 border-dashed border-gray-600 rounded-lg hover:border-blue-500 cursor-pointer transition-colors">
        <Upload size={24} className="mb-2" />
        <span className="text-sm text-center">Upload 3D Model</span>
        <span className="text-xs text-gray-500 mt-1">
          {supportedFormats.join(', ')}
        </span>
        <input
          type="file"
          accept={supportedFormats.join(',')}
          onChange={handleFileChange}
          className="hidden"
        />
      </label>
    </div>
  );
};

export default ModelImporter;