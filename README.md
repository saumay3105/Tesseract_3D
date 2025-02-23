# Tesseract3D

Tesseract3D is a powerful 3D design tool that enables developers and designers to create, edit, and animate 3D scenes directly in the browser and export them as React components. Perfect for creating interactive 3D experiences for your web applications.

## Features

### Model Management
- Choose from a curated library of pre-built 3D models
- Import custom 3D models (supports GLB, GLTF formats)
- Add multiple models to a single scene
- Create and edit 3D text
- Organize models in the scene using easy-to-use controls

### Animation Capabilities
- Apply predefined animations to any model
- Create custom animations using transform controls
- Timeline interface for precise animation timing
- Keyframe-based animation system
- Real-time animation preview

### Scene Customization
- Multiple environment presets
- Custom background colors and gradients

### Export Options
- Export entire scenes as React components
- Automatic generation of required Three.js code
- Optimized for web performance
- Guide for component usage

### Experience
- Clean, intuitive user interface
- Keyboard shortcuts for interacting with the scene

## Getting Started

### Prerequisites

Ensure you have the following installed on your system:

- **Node.js:** For running the React frontend.
- **Git**


### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/33Surya66/Tesseract_3D.git
```

#### 2. Setup

Navigate to the `backend` directory and install the dependencies:

```bash
cd 3DEditor
npm install
```

Start the React development server:

```bash
npm run dev
```

### Usage

1. **Access the Application:**
   Open your web browser and navigate to `http://localhost:5173` to start using Tesseract3D.

2. **Create or Import a Model**  
   - Choose from the **model library** or **upload a custom 3D model** (GLB, GLTF) to add to the scene.  

3. **Customize the Scene**
   - Interact with the scene using these keyboard shortcuts
       - Hold Alt for rotation with cursor
       - Hold Ctrl for panning with cursor
       - Scroll for zooming in/out
       - Del for deleting a model
       - Esc for unselecting a model
   - Adjust environment and background colors.  
   - Organize models with **transform controls** (move, scale, rotate).  
   - Add and edit 3D text.  

5. **Animate Your Models**  
   - Apply predefined animations or create custom ones using transform controls.  
   - Use the **timeline interface** to manage keyframes.  
   - Preview animations in real-time.  

6. **Export as a React Component**  
   - Click the **Export** button to generate a **React component**.  
   - Download the generated code for direct integration into your web project.
  
     
## Tech Stack

- **Frontend**: React
- **3D Rendering**: Three.js
- **Build Tools**: Vite

## License

