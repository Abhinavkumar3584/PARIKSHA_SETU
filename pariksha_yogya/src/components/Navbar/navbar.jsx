import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown, Search } from "lucide-react";
import { Link } from "react-router-dom";
import login from "../../Pages/login";
import signup from "../../Pages/signup";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Add scroll event listener for blur effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-1 left-3 right-3 z-50">
      <nav
        className={`max-w-8xl px-4 sm:px-2 md:px-4 py-1.5 rounded-lg shadow-lg transition-all duration-300 
          ${
            isScrolled ? "backdrop-blur-lg bg-white/15" : "bg-white"
          } border border-gray-300`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center h-10 sm:h-12">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="./logos/py.svg"
              alt="Pariksha Yogya Logo"
              className="h-10 w-10"
            />
            <img
              src="./logos/py_name.svg"
              alt="Pariksha Yogya"
              className="h-5 sm:h-6"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            <a href="/" className="text-gray-700 hover:text-blue-500">
              Home
            </a>
            <a href="/about" className="text-gray-700 hover:text-blue-500">
              About Us
            </a>
            <a
              href="/contribution"
              className="text-gray-700 hover:text-blue-500"
            >
              Contribution
            </a>
            <a href="/contact" className="text-gray-700 hover:text-blue-500">
              Contact Us
            </a>

            {/* Features Dropdown with Animation */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center text-gray-700 hover:text-blue-500 focus:outline-none"
              >
                Features
                <ChevronDown
                  className={`ml-1 w-4 h-4 transition-transform duration-300 ${
                    isDropdownOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>

              {/* Dropdown Items with Animation */}
              <div
                className={`absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-50 transition-all duration-300 transform origin-top 
                      ${
                        isDropdownOpen
                          ? "opacity-100 scale-y-100"
                          : "opacity-0 scale-y-0 pointer-events-none"
                      }`}
              >
                <a
                  href="/"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  PARIKSHA YOGYA
                </a>
                <a
                  href="https://marg.psetu.com/"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  PARIKSHA MARG
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  PARIKSHA GYAN
                </a>
              </div>
            </div>

            {/* Search Bar */}
            <input
                  type="text"
                  placeholder="Search in site"
                  className="border px-2 py-1 rounded-md text-sm"
                />
                <a href="/login" className="text-gray-700 hover:text-blue-500">
                  Log In
                </a>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Try for Free
                </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-gray-700 p-2 focus:outline-none"
              aria-expanded={isOpen}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden bg-white border-t absolute left-4 right-4 shadow-md rounded-b-lg overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen
              ? "max-h-[500px] opacity-100"
              : "max-h-0 opacity-0 pointer-events-none"
          }`}
        >
          <div className="py-2 animate-fadeIn">
            <a
              href="/"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-center"
            >
              Home
            </a>
            <a
              href="/about"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-center"
            >
              About Us
            </a>
            <a
              href="/contribution"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-center"
            >
              Contribution
            </a>
            <a
              href="/contact"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-center"
            >
              Contact Us
            </a>

            {/* Features Dropdown in Mobile with Improved Animation */}
            <div className="px-4 py-1">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full text-center py-2 flex items-center justify-center text-gray-700 hover:text-blue-500 focus:outline-none"
              >
                Features
                <ChevronDown
                  className={`ml-1 w-4 h-4 transition-transform duration-300 ${
                    isDropdownOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>
              <div
                className={`mt-1 bg-gray-50 rounded-lg overflow-hidden transition-all duration-300 ease-in-out ${
                  isDropdownOpen
                    ? "max-h-[200px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <a
                  href="/"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-center"
                >
                  PARIKSHA YOGYA
                </a>
                <a
                  href="https://marg.psetu.com/"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-center"
                >
                  PARIKSHA MARG
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-center"
                >
                  PARIKSHA GYAN
                </a>
              </div>
            </div>

            {/* Search Input with Proper Margins */}
            <div className="px-4 mt-2">
                <input
                  type="text"
                  placeholder="Search in site"
                  className="w-full border px-4 py-2 rounded-md text-sm"
                />
              </div>

              <a
                href="/login"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-center mt-1"
              >
                Log In
              </a>

            {/* Button with Proper Margins */}
            <div className="px-4 py-2">
                <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Try for Free
                </button>
              </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
