import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Apple, Facebook, Github, Twitter } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle signup logic here
    console.log({ name, email, password, rememberMe });
  };

  return (
    <div className="flex h-[calc(100vh-14px)] bg-gray-50 overflow-hidden pt-[74px]">
      {/* Left side - Image */}
      <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="h-full w-full">
          <img
            src="./loginsignupsideimage/sideimage.png"
            alt="Signup"
            className="w-full h-full object-cover opacity-100"
          />
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex flex-col w-full md:w-1/2 justify-center items-center px-6 py-4">
        <div className="w-full max-w-md">
          <h1 className="text-xl font-bold text-gray-800 mb-1 text-center">Create Account</h1>
          <p className="text-center text-gray-600 text-sm mb-2">Join Pariksha Yogya community today</p>

          {/* Social Signup Buttons - Grid Layout */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button className="flex items-center justify-center gap-2 bg-black text-white py-2 px-3 rounded-lg hover:bg-gray-800 transition text-sm">
              <Apple size={16} /> Apple
            </button>
            <button className="flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition text-sm">
              <Facebook size={16} /> Facebook
            </button>
            <button className="flex items-center justify-center gap-2 bg-gray-800 text-white py-2 px-3 rounded-lg hover:bg-gray-900 transition text-sm">
              <Github size={16} /> Github
            </button>
            <button className="flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-300 py-2 px-3 rounded-lg hover:bg-gray-100 transition text-sm">
              <FcGoogle size={16} /> Google
            </button>
            <button className="col-span-2 flex items-center justify-center gap-2 bg-black text-white py-2 px-3 rounded-lg hover:bg-gray-800 transition text-sm">
              <Twitter size={16} /> Twitter(X)
            </button>
          </div>

          {/* Or Divider */}
          <div className="flex items-center my-2">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-gray-500 text-xs">or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-2">
            <div>
              <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-1 text-left">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1 text-left">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1 text-left">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-3 w-3 text-blue-600 rounded border-gray-300"
                />
                <label htmlFor="remember-me" className="ml-2 block text-xs text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-xs">
                <Link to="/forgot-password" className="text-blue-600 hover:text-blue-800">
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-sm mt-2"
            >
              Sign up
            </button>

            <p className="text-xs text-center text-gray-600 mt-2">
              By signing in, you agree to our{" "}
              <Link to="/privacy-policy" className="text-blue-600 hover:underline">
                privacy policy
              </Link>
              ,{" "}
              <Link to="/terms" className="text-blue-600 hover:underline">
                terms
              </Link>
              {" & "}
              <Link to="/code-of-conduct" className="text-blue-600 hover:underline">
                code of conduct
              </Link>
              .
            </p>
          </form>

          <p className="text-center mt-3 text-sm text-gray-700">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:text-blue-800">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;