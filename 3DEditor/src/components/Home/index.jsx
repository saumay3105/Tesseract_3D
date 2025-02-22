import { lazy, Suspense } from "react";
import { Background3D } from "../Background/Background3D";
const Header = lazy(() => import("../Header"));

const LoadingSpinner = () => (
  <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
    <div className="text-white text-xl">Loading...</div>
  </div>
);

const Home = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white relative overflow-hidden">
      <Suspense fallback={<LoadingSpinner />}>
        <Background3D />
      </Suspense>

      
      <div className="relative z-10">
        <Suspense fallback={<LoadingSpinner />}>
          <Header />
        </Suspense>

        <main className="max-w-7xl mx-auto px-4 pt-20 pb-32">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-6xl font-bold mb-6">
              Tesseract, a place to create and
              <br />
              explore in 3D.
            </h1>

            <div className="flex gap-4 mb-12 text-gray-400">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Web-Based</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Real-time</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Collaborative</span>
              </div>
            </div>

            <a
              href="/playground"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Get started — it's free →
            </a>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
