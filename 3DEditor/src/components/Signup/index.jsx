import React from "react";
import { Suspense } from "react";
import { Background3D } from "../Background/Background3D";


const LoadingSpinner = () => (
    <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
      <div className="text-white text-xl">Loading...</div>
    </div>
  );
  
const Signup = () => {
    return (
      <div className="min-h-screen bg-[#0A0A0B] text-white relative overflow-hidden">
        <Suspense fallback={<LoadingSpinner />}>
          <Background3D/>
        </Suspense>
  
        <div className="relative z-10">
          <main className="max-w-md mx-auto px-4 pt-20 pb-32">
            <div className="bg-[#1A1A1B] p-8 rounded-2xl shadow-xl">
              <h1 className="text-4xl font-bold mb-8 text-center">Create Account</h1>
              
              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="w-full bg-[#2A2A2B] rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      placeholder="First name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="w-full bg-[#2A2A2B] rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      placeholder="Last name"
                    />
                  </div>
                </div>
  
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
                    placeholder="Create a password"
                  />
                </div>
  
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    className="w-full bg-[#2A2A2B] rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    placeholder="Confirm your password"
                  />
                </div>
  
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-600 text-blue-600 focus:ring-blue-600"
                  />
                  <label className="ml-2 text-sm text-gray-400">
                    I agree to the{" "}
                    <a href="/terms" className="text-blue-600 hover:text-blue-500">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" className="text-blue-600 hover:text-blue-500">
                      Privacy Policy
                    </a>
                  </label>
                </div>
  
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Create Account
                </button>
              </form>
  
              <p className="mt-6 text-center text-gray-400">
                Already have an account?{" "}
                <a href="/login" className="text-blue-600 hover:text-blue-500">
                  Sign in
                </a>
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  };

  export default Signup;