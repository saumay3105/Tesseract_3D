# Tesseract3D

Tesseract3D is a powerful 3D design tool that enables developers and designers to create, edit, and animate 3D scenes directly in the browser and export them as React components. Perfect for creating interactive 3D experiences for your web applications.

## 🚀 Features

### 🎨 Model Management
- Choose from a curated library of pre-built 3D models
- Import custom 3D models (supports **GLB, GLTF** formats)
- Add multiple models to a single scene
- Create and edit 3D text
- Organize models in the scene using intuitive controls

### 🎬 Animation Capabilities
- Apply **predefined animations** to any model
- Create **custom animations** using transform controls
- **Timeline interface** for precise animation timing
- **Keyframe-based animation system**
- Real-time **animation preview**

### 🖌️ Scene Customization
- Multiple **environment presets**
- Custom **background colors and gradients**

### 📤 Export Options
- Export entire scenes as **React components**
- Automatic generation of required **Three.js** code
- Optimized for **web performance**
- Guide for **component usage**

### 🎛️ Experience
- Clean, **intuitive user interface**
- **Keyboard shortcuts** for interacting with the scene

---

## 🛠 Getting Started

### Prerequisites
Ensure you have the following installed on your system:

- **Node.js**: For running the React frontend.
- **Git**: To clone the repository.

### 🔧 Installation

#### 1️⃣ Clone the Repository
```bash
git clone https://github.com/33Surya66/Tesseract_3D.git
```

#### 2️⃣ Setup
Navigate to the `backend` directory and install the dependencies:
```bash
cd 3DEditor
npm install
```

Start the development server:
```bash
npm run dev
```

---

## 🎮 Usage

1. **Access the Application:**  
   Open your web browser and navigate to `http://localhost:5173`.

2. **Create or Import a Model**  
   - Choose from the **model library** or **upload a custom 3D model** (GLB, GLTF).

3. **Customize the Scene**  
   - **Keyboard Shortcuts:**
     - Hold **Alt** → Rotate with cursor
     - Hold **Ctrl** → Pan with cursor
     - **Scroll** → Zoom in/out
     - **Del** → Delete a model
     - **Esc** → Unselect a model
   - Adjust environment and background colors.
   - Organize models with **transform controls** (move, scale, rotate).
   - Add and edit **3D text**.

4. **Animate Your Models**  
   - Apply **predefined animations** or create custom ones.
   - Use the **timeline interface** to manage keyframes.
   - Preview animations in real-time.

5. **Export as a React Component**  
   - Click the **Export** button to generate a **React component**.
   - Download the generated code for direct integration into your web project.

---

## 🏗 Tech Stack

- **Frontend:** React
- **3D Rendering:** Three.js
- **Build Tools:** Vite

---

## 🤝 Contributing

We welcome contributions from the community! Please read our [CONTRIBUTING.md](./CONTRIBUTING.md) before making any changes.


## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
