import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="fixed w-full bg-transparent backdrop-blur-sm z-50">
      <nav className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-white text-2xl font-bold">
            Tesseract
          </Link>
          <Link
            to="/playground"
            onClick={(e) => {
              e.preventDefault(); // Prevents React Router from handling the navigation
              window.open("/playground", "_blank", "noopener,noreferrer");
            }}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-full text-sm transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
