import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('../components/Home'));
const Playground = lazy(() => import('../components/Playground'));

const LoadingSpinner = () => (
  <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
    <div className="text-white text-xl">Loading...</div>
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route 
          path="/" 
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <Home />
            </Suspense>
          } 
        />
        <Route 
          path="/playground" 
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <Playground />
            </Suspense>
          } 
        />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;