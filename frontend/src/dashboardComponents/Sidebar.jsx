import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import CameraCapture from './CameraCapture';

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailFetching, setIsEmailFetching] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'bg-purple-500/30 text-white' : 'text-white/70 hover:text-white';

  const handleFileUpload = async (file) => {
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
        window.location.reload();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      alert('Error uploading receipt: ' + error.message);
    } finally {
      setIsLoading(false);
      setIsDropdownOpen(false);
      setShowCamera(false);
    }
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFileUpload(file);
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

  const openCamera = () => {
    setShowCamera(true);
    setIsDropdownOpen(false);
  };

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white/5 backdrop-blur-md
          transition-all duration-200 ease-in-out border cursor-pointer border-white/10 rounded-xl shadow-lg text-white p-3 hover:bg-white/10"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        />
      )}

      {/* Sidebar for mobile */}
      <div
        className={`fixed top-0 left-0 h-full w-72 text-white z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden border-r border-white/10 bg-black/90 backdrop-blur-xl`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Where's My Money?</h2>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-lg cursor-pointer">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <ul className="space-y-3">
            <li>
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
              >
                <button className={`w-full flex items-center gap-3 p-3 cursor-pointer rounded-xl transition-all duration-200 ${isActive('/')}`}>
                  <svg className="w-5 h-5 " fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  My Dashboard
                </button>
              </Link>
            </li>
            <li>
              <Link
                to="/receipts"
                onClick={() => setIsOpen(false)}
              >
                <button className={`w-full flex items-center gap-3 p-3 cursor-pointer rounded-xl transition-all duration-200 ${isActive('/receipts')}`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Receipts
                </button>
              </Link>
            </li>
            <li className="relative pt-4">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-purple-500 cursor-pointer hover:bg-purple-600 transition-all duration-200"
                disabled={isLoading || isEmailFetching}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {isLoading || isEmailFetching ? 'Processing...' : 'Add Receipt'}
              </button>
              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 bg-gray-900/95 backdrop-blur-sm text-white rounded-xl shadow-xl mt-2 overflow-hidden z-60">
                  <ul className="divide-y divide-white/10">
                    <li>
                      <label className="flex items-center gap-3 p-4 hover:bg-white/10 cursor-pointer">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileInputChange}
                          className="hidden"
                        />
                        Upload Picture
                      </label>
                    </li>
                    <li>
                      <button onClick={openCamera} className="flex items-center gap-3 p-4 w-full cursor-pointer hover:bg-white/10">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Take Picture
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={fetchEmailReceipts} 
                        className="flex cursor-pointer items-center gap-3 p-4 w-full hover:bg-white/10"
                        disabled={isEmailFetching}
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {isEmailFetching ? 'Fetching...' : 'Fetch from Email'}
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </li>
          </ul>
        </div>
      </div>

      {/* Top Navbar for desktop */}
      <div className="hidden md:flex items-center justify-between fixed top-0 left-0 right-0 h-16 text-white p-4 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Where's My Money?</h2>
        
        <ul className="flex items-center gap-2">
          <li>
            <Link to="/" className="hover:text-white">
              <button className={`px-4 py-2 rounded-xl transition-all duration-200 cursor-pointer ${isActive('/')}`}>
                My Dashboard
              </button>
            </Link>
          </li>
          <li>
            <Link to="/receipts" className="hover:text-white">
              <button className={`px-4 py-2 rounded-xl transition-all duration-200 cursor-pointer ${isActive('/receipts')}`}>
                Receipts
              </button>
            </Link>
          </li>
        </ul>

        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-all duration-200 flex cursor-pointer items-center gap-2"
            disabled={isLoading || isEmailFetching}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {isLoading || isEmailFetching ? 'Processing...' : 'Add Receipt'}
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full right-0 bg-gray-900/95 backdrop-blur-sm text-white rounded-xl shadow-xl mt-2 w-48 overflow-hidden z-60">
              <ul className="divide-y divide-white/10">
                <li>
                  <label className="flex items-center gap-3 p-4 hover:bg-white/10 cursor-pointer">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />
                    Upload Picture
                  </label>
                </li>
                <li>
                  <button onClick={openCamera} className="flex items-center gap-3 p-4 w-full hover:bg-white/10 cursor-pointer">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Take Picture
                  </button>
                </li>
                <li>
                  <button 
                    onClick={fetchEmailReceipts} 
                    className="flex items-center gap-3 p-4 w-full hover:bg-white/10 cursor-pointer"
                    disabled={isEmailFetching}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {isEmailFetching ? 'Fetching...' : 'Fetch from Email'}
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Camera Component */}
      {showCamera && (
        <CameraCapture
          onCapture={handleFileUpload}
          onClose={() => setShowCamera(false)}
        />
      )}
    </>
  );
}

export default Sidebar;