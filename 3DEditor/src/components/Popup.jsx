import React from 'react';
import { Copy, CheckCircle2, X } from 'lucide-react';

const ExportPopup = ({ isOpen, onClose, onExport }) => {
  const [copied, setCopied] = React.useState(false);
  const [exported, setExported] = React.useState(false);

  if (!isOpen) return null;

  const installCommand = `npm install @react-three/fiber @react-three/drei three`;

  const handleCopy = () => {
    navigator.clipboard.writeText(installCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    onExport();
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold mb-4">Export Scene</h2>
        <p className="text-gray-600 mb-6">
          Follow these steps to use your exported scene in your React project
        </p>

        <div className="space-y-6">
          {/* Install Dependencies Section */}
          <div>
            <h3 className="font-medium mb-2">1. Install Required Dependencies</h3>
            <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-md">
              <code className="text-sm flex-1">{installCommand}</code>
              <button
                onClick={handleCopy}
                className="p-2 hover:bg-gray-200 rounded-md transition-colors"
              >
                {copied ? 
                  <CheckCircle2 className="w-4 h-4 text-green-500" /> : 
                  <Copy className="w-4 h-4" />
                }
              </button>
            </div>
          </div>

          {/* Export Section */}
          <div>
            <h3 className="font-medium mb-2">2. Export Scene File</h3>
            <button
              onClick={handleExport}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
            >
              {exported ? 'Exported!' : 'Export CompiledScene.jsx'}
            </button>
          </div>

          {/* Usage Instructions */}
          <div>
            <h3 className="font-medium mb-2">3. Usage Instructions</h3>
            <div className="bg-gray-100 p-4 rounded-md">
              <p className="text-sm text-gray-600 mb-2">
                Import and use the scene component in your React application:
              </p>
              <pre className="bg-gray-200 p-3 rounded-md text-sm">
                {`import Scene from './CompiledScene';\n\nfunction App() {\n  return <Scene />;\n}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportPopup;