import { useState } from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-50 bg-slate-700 text-white px-4 py-2 rounded-md hover:bg-slate-600"
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
        className={`fixed top-0 left-0 h-full w-64 bg-slate-800 text-white p-6 z-50 transform transition-transform duration-300 ${
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
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/receipts"
              className="hover:text-green-400"
              onClick={() => setIsOpen(false)}
            >
              Receipts
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
