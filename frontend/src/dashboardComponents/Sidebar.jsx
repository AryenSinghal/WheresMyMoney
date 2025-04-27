import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailFetching, setIsEmailFetching] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'bg-[#5900a1] text-white' : '';

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('http://localhost:5001/process-receipt', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      
      if (response.ok) {
        alert(`Receipt processed successfully!\nMerchant: ${data.data.merchant_name}\nAmount: $${data.data.amount}\nCategory: ${data.data.category}`);
        // Refresh the page to show new expense
        window.location.reload();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      alert('Error uploading receipt: ' + error.message);
    } finally {
      setIsLoading(false);
      setIsDropdownOpen(false);
    }
  };

  const fetchEmailReceipts = async () => {
    setIsEmailFetching(true);
    try {
      const response = await fetch('http://localhost:5001/process-email-receipts', {
        method: 'POST'
      });

      const data = await response.json();
      
      if (response.ok) {
        alert(`${data.message}\nProcessed ${data.data.length} receipts from email.`);
        // Refresh the page to show new expenses
        window.location.reload();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      alert('Error fetching email receipts: ' + error.message);
    } finally {
      setIsEmailFetching(false);
      setIsDropdownOpen(false);
    }
  };

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // You would typically show a camera preview and capture functionality here
      // For now, we'll just use a regular file input
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment';
      input.onchange = handleFileUpload;
      input.click();
    } catch (error) {
      alert('Camera access denied. Please use file upload instead.');
    }
  };

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white/10 backdrop-blur-md
          transition-all duration-200 ease-in-out border border-white/20 rounded-xl shadow-lg text-white px-4 py-2 rounded-md hover:bg-purple-900 active:bg-purple-950"
      >
        ☰
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black opacity-70 z-40"
        />
      )}

      {/* Sidebar for mobile */}
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
          <li className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="text-white p-2 rounded-lg w-55 h-15 hover:bg-[#5900a1] active:bg-[#4a0080] outline transition-all duration-200 ease-in-out"
              disabled={isLoading || isEmailFetching}
            >
              {isLoading || isEmailFetching ? 'Processing...' : '+ Add Receipt'}
            </button>
            {isDropdownOpen && (
              <div className="absolute top-full right-0 bg-white text-black p-4 rounded-lg shadow-lg mt-2 w-48 z-60">
                <ul className="space-y-2">
                  <li>
                    <label className="hover:text-green-400 cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      Upload Picture
                    </label>
                  </li>
                  <li>
                    <button onClick={openCamera} className="hover:text-green-400">
                      Take Picture
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={fetchEmailReceipts} 
                      className="hover:text-green-400"
                      disabled={isEmailFetching}
                    >
                      {isEmailFetching ? 'Fetching...' : 'Fetch from Email'}
                    </button>
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

      {/* Top Navbar for desktop */}
      <div className="hidden md:flex items-center justify-between text-white p-4 z-50 border border-white/20">
        <h2 className="text-2xl font-bold">Where's My Money?</h2>
        
        <ul className="flex space-x-6 flex-grow justify-center ml-[-20px]">
          <li>
            <Link to="/" className="hover:text-green-400">
              <button className={`text-white p-2 rounded-lg transition-all duration-200 ease-in-out ${isActive('/')}`}>
                My Dashboard
              </button>
            </Link>
          </li>
          <li>
            <Link to="/receipts" className="hover:text-green-400">
              <button className={`text-white p-2 rounded-lg transition-all duration-200 ease-in-out ${isActive('/receipts')}`}>
                Receipts
              </button>
            </Link>
          </li>
        </ul>

        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="text-white p-2 rounded-lg w-35 h-10 hover:bg-[#5900a1] active:bg-[#4a0080] outline transition-all duration-200 ease-in-out"
            disabled={isLoading || isEmailFetching}
          >
            {isLoading || isEmailFetching ? 'Processing...' : '+ Add Receipt'}
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full right-0 bg-white text-black p-4 rounded-lg shadow-lg mt-2 w-48 z-60">
              <ul className="space-y-2">
                <li>
                  <label className="hover:text-green-400 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    Upload Picture
                  </label>
                </li>
                <li>
                  <button onClick={openCamera} className="hover:text-green-400">
                    Take Picture
                  </button>
                </li>
                <li>
                  <button 
                    onClick={fetchEmailReceipts} 
                    className="hover:text-green-400"
                    disabled={isEmailFetching}
                  >
                    {isEmailFetching ? 'Fetching...' : 'Fetch from Email'}
                  </button>
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