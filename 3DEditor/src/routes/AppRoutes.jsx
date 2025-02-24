import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../components/Login";
import Signup from "../components/Signup";

const Home = lazy(() => import("../components/Home"));
const Playground = lazy(() => import("../components/Playground"));

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
        <Route
          path="/log-in"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <Login />
            </Suspense>
          }
        />
        <Route
          path="/sign-up"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <Signup/>
            </Suspense>
          }
        />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
