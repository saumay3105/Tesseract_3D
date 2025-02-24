import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="fixed w-full bg-transparent backdrop-blur-sm z-50">
      <nav className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="text-white text-2xl font-bold"
          >
            Tesseract
          </Link>

          <div className="flex items-center space-x-4">
            <Link
              to="/log-in"
              className="text-white hover:text-gray-300 px-6 py-2 text-sm transition-colors"
            >
              Login
            </Link>
            <Link
              to="/sign-up"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-sm transition-colors"
            >
              Sign up
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;