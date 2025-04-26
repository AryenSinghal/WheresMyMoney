import { useState } from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-50 bg-white/10 backdrop-blur-md
        transition-all duration-200 ease-in-out
        border border-white/20 rounded-xl shadow-lg   text-white px-4 py-2 rounded-md hover:bg-purple-900 active:bg-purple-950"
      >
        Menu
      </button>

      

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black opacity-70 z-40"
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-67 bg-gradient-to-b from-[#3a0d68] via-[#2a0e4a] to-purple-700 text-white p-6 z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <h2 className="text-2xl font-bold mb-6">Where's My Money?</h2>
        <ul className="space-y-4">
          <li>
            <Link
              to="/"
              className="hover:text-green-400"
              onClick={() => setIsOpen(false)}
            >
             <button className=" text-white p-2 rounded-lg w-55 h-15 hover:bg-[#5900a1] active:bg-[#4a0080] outline transition-all duration-200 ease-in-out">
          Dashboard
        </button>
            </Link>
          </li>
          <li>
            <Link
              to="/receipts"
              className="hover:text-green-400"
              onClick={() => setIsOpen(false)}
            >
              <button className=" text-white p-2 rounded-lg w-55 h-15 hover:bg-[#5900a1] active:bg-[#4a0080] outline transition-all duration-200 ease-in-out">
          Receipts
        </button>
            </Link>
          </li>
        </ul>

        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-xl"
        >
          ✕
        </button>
      </div>
    </>
  );
}

export default Sidebar;
