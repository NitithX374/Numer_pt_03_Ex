import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';

const NavbarComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRootDropdownOpen, setIsRootDropdownOpen] = useState(false);
  const [isLinearDropdownOpen, setIsLinearDropdownOpen] = useState(false);
  const rootDropdownRef = useRef(null);
  const linearDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (rootDropdownRef.current && !rootDropdownRef.current.contains(event.target)) {
        setIsRootDropdownOpen(false);
      }
      if (linearDropdownRef.current && !linearDropdownRef.current.contains(event.target)) {
        setIsLinearDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleRootDropdown = (e) => {
    e.stopPropagation();
    setIsRootDropdownOpen(!isRootDropdownOpen);
    setIsLinearDropdownOpen(false); // ปิด dropdown อื่นเมื่อเปิดอันนี้
  };

  const toggleLinearDropdown = (e) => {
    e.stopPropagation();
    setIsLinearDropdownOpen(!isLinearDropdownOpen);
    setIsRootDropdownOpen(false); // ปิด dropdown อื่นเมื่อเปิดอันนี้
  };

  return (
    <nav className="bg-gray-900 shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <a href="/" className="text-white text-xl font-bold">
              My Website
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-gray-300 hover:text-white">
              Home
            </a>
            <a href="#about" className="text-gray-300 hover:text-white">
              About
            </a>
            
            {/* Root of Equation Dropdown */}
            <div className="relative" ref={rootDropdownRef}>
              <button 
                onClick={toggleRootDropdown}
                className="text-gray-300 hover:text-white inline-flex items-center"
              >
                <span>Root of Equation</span>
                <ChevronDown className={`ml-1 h-4 w-4 transform transition-transform duration-200 ${isRootDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isRootDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <a href="/Graphical" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                      Graphical Method
                    </a>
                    <a href="/Bisection" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                      Bisection Method
                    </a>
                    <a href="/False-Position" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                      False Position Method
                    </a>
                    <a href="/onepoint" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                      Onepoint Iteration Method
                    </a>
                    <a href="/Newton" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                      Newton Method
                    </a>
                    <a href="/Secant" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                      Secant Method
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Linear Algebra Dropdown */}
            <div className="relative" ref={linearDropdownRef}>
              <button 
                onClick={toggleLinearDropdown}
                className="text-gray-300 hover:text-white inline-flex items-center"
              >
                <span>Linear Algebra Equations</span>
                <ChevronDown className={`ml-1 h-4 w-4 transform transition-transform duration-200 ${isLinearDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isLinearDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <a href="/Cramer" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                      Cramer's rule
                    </a>
                    <a href="/Gauss" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                      Guass Elimination
                    </a>
                    <a href="/Gauss-Jordan" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                      Gauss-Jordan Elimination
                    </a>
                    <a href="/Matrix-Inversion" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                      Matrix Inversion
                    </a>
                    <a href="/LU" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                      LU Decomposition Method
                    </a>
                    <a href="/Cholesky" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                      Cholesky Decomposition Method
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="/" className="block px-3 py-2 text-gray-300 hover:text-white">
                Home
              </a>
              <a href="#about" className="block px-3 py-2 text-gray-300 hover:text-white">
                About
              </a>
              
              {/* Mobile Root of Equation Dropdown */}
              <div>
                <button
                  onClick={toggleRootDropdown}
                  className="flex justify-between items-center w-full px-3 py-2 text-gray-300 hover:text-white"
                >
                  <span>Root of Equation</span>
                  <ChevronDown className={`h-4 w-4 transform transition-transform duration-200 ${isRootDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isRootDropdownOpen && (
                  <div className="pl-4">
                    <a href="/Graphical" className="block px-3 py-2 text-gray-300 hover:text-white">
                      Graphical Method
                    </a>
                    <a href="/Bisection" className="block px-3 py-2 text-gray-300 hover:text-white">
                      Bisection Method
                    </a>
                    <a href="/False-Position" className="block px-3 py-2 text-gray-300 hover:text-white">
                      False Position Method
                    </a>
                    <a href="/onepoint" className="block px-3 py-2 text-gray-300 hover:text-white">
                      Onepoint Iteration Method
                    </a>
                    <a href="/Newton" className="block px-3 py-2 text-gray-300 hover:text-white">
                      Newton Method
                    </a>
                    <a href="/Secant" className="block px-3 py-2 text-gray-300 hover:text-white">
                      Secant Method
                    </a>
                  </div>
                )}
              </div>

              {/* Mobile Linear Algebra Dropdown */}
              <div>
                <button
                  onClick={toggleLinearDropdown}
                  className="flex justify-between items-center w-full px-3 py-2 text-gray-300 hover:text-white"
                >
                  <span>Linear Algebra Equations</span>
                  <ChevronDown className={`h-4 w-4 transform transition-transform duration-200 ${isLinearDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isLinearDropdownOpen && (
                  <div className="pl-4">
                    <a href="/Cramer" className="block px-3 py-2 text-gray-300 hover:text-white">
                      Cramer's rule
                    </a>
                    <a href="/Gauss" className="block px-3 py-2 text-gray-300 hover:text-white">
                      Guass Elimination
                    </a>
                    <a href="/Gauss-Jordan" className="block px-3 py-2 text-gray-300 hover:text-white">
                      Gauss-Jordan Elimination
                    </a>
                    <a href="/Matrix-Inversion" className="block px-3 py-2 text-gray-300 hover:text-white">
                      Matrix Inversion
                    </a>
                    <a href="/LU" className="block px-3 py-2 text-gray-300 hover:text-white">
                      LU Decomposition Method
                    </a>
                    <a href="/Cholesky" className="block px-3 py-2 text-gray-300 hover:text-white">
                      Cholesky Decomposition Method
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavbarComponent;