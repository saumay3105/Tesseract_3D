import { Suspense } from "react";
import { Background3D } from "../Background/Background3D";
import React from "react";

const LoadingSpinner = () => (
  <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
    <div className="text-white text-xl">Loading...</div>
  </div>
);

const Login = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white relative overflow-hidden">
      <Suspense fallback={<LoadingSpinner />}>
        <Background3D/>
      </Suspense>

      <div className="relative z-10">
        <main className="max-w-md mx-auto px-4 pt-20 pb-32">
          <div className="bg-[#1A1A1B] p-8 rounded-2xl shadow-xl">
            <h1 className="text-4xl font-bold mb-8 text-center">Welcome Back</h1>
            
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full bg-[#2A2A2B] rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full bg-[#2A2A2B] rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  placeholder="Enter your password"
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-600 text-blue-600 focus:ring-blue-600"
                  />
                  <label className="ml-2 text-gray-400">Remember me</label>
                </div>
                <a href="/forgot-password" className="text-blue-600 hover:text-blue-500">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Sign in
              </button>
            </form>

            <p className="mt-6 text-center text-gray-400">
              Don't have an account?{" "}
              <a href="/signup" className="text-blue-600 hover:text-blue-500">
                Sign up
              </a>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};
export default Login;