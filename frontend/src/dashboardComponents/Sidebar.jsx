import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to handle dropdown visibility
  const location = useLocation(); // Get current location to highlight active button

  // Function to determine if the current route is active
  const isActive = (path) => location.pathname === path ? 'bg-[#5900a1] text-white' : '';

  return (
    <>
      {/* Hamburger Button (visible only on small screens) */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white/10 backdrop-blur-md
          transition-all duration-200 ease-in-out border border-white/20 rounded-xl shadow-lg text-white px-4 py-2 rounded-md hover:bg-purple-900 active:bg-purple-950"
      >
        ☰ {/* Hamburger Icon */}
      </button>

      {/* Overlay when the sidebar is open */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black opacity-70 z-40"
        />
      )}

      {/* Sidebar (only visible on small screens, transforms into a top navbar on larger screens) */}
      <div
        className={`fixed top-0 left-0 h-full w-67 text-white p-6 z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden border-b-2 border-white`}
      >
        <h2 className="text-2xl font-bold mb-6">Where's My Money?</h2>
        <ul className="space-y-4">
          <li>
            <Link
              to="/"
              className="hover:text-green-400"
              onClick={() => setIsOpen(false)}
            >
              <button className={`text-white p-2 rounded-lg w-55 h-15 transition-all duration-200 ease-in-out ${isActive('/')}`}>
                My Dashboard
              </button>
            </Link>
          </li>
          <li>
            <Link
              to="/receipts"
              className="hover:text-green-400"
              onClick={() => setIsOpen(false)}
            >
              <button className={`text-white p-2 rounded-lg w-55 h-15 transition-all duration-200 ease-in-out ${isActive('/receipts')}`}>
                Receipts
              </button>
            </Link>
          </li>
          {/* Dropdown Button "+" */}
          <li className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="text-white p-2 rounded-lg w-55 h-15 hover:bg-[#5900a1] active:bg-[#4a0080] outline transition-all duration-200 ease-in-out"
            >
              + Add Receipt {/* "+" Button for dropdown */}
            </button>
            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute top-full right-0 bg-white text-black p-4 rounded-lg shadow-lg mt-2 w-48 z-60">
                <ul className="space-y-2">
                  <li>
                    <button className="hover:text-green-400">Upload Picture</button>
                  </li>
                  <li>
                    <button className="hover:text-green-400">Take Picture</button>
                  </li>
                </ul>
              </div>
            )}
          </li>
        </ul>
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-xl"
        >
          ✕
        </button>
      </div>

      {/* Top Navbar (only visible on medium screens and larger) */}
      <div className="hidden md:flex items-center justify-between text-white p-4 z-50 border border-white/20">
        <h2 className="text-2xl font-bold">Where's My Money?</h2>
        
        {/* Centered buttons: Dashboard and Receipts */}
        <ul className="flex space-x-6 flex-grow justify-center ml-[-20px]"> {/* Shift left by 20px */}
          <li>
            <Link
              to="/"
              className="hover:text-green-400"
            >
              <button className={`text-white p-2 rounded-lg transition-all duration-200 ease-in-out ${isActive('/')}`}>
                My Dashboard
              </button>
            </Link>
          </li>
          <li>
            <Link
              to="/receipts"
              className="hover:text-green-400"
            >
              <button className={`text-white p-2 rounded-lg transition-all duration-200 ease-in-out ${isActive('/receipts')}`}>
                Receipts
              </button>
            </Link>
          </li>
        </ul>

        {/* Add Receipt Button on the right */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="text-white p-2 rounded-lg w-35 h-10 hover:bg-[#5900a1] active:bg-[#4a0080] outline transition-all duration-200 ease-in-out"
          >
            + Add Receipt {/* "+" Button for dropdown */}
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute top-full right-0 bg-white text-black p-4 rounded-lg shadow-lg mt-2 w-48 z-60">
              <ul className="space-y-2">
                <li>
                  <button className="hover:text-green-400">Upload Picture</button>
                </li>
                <li>
                  <button className="hover:text-green-400">Take Picture</button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Sidebar;
