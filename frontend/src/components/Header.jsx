import React from 'react';

function Header() {
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the auth token
    window.location.reload(); // Reload the page
  };

  return (
    <header className="bg-black shadow-sm py-4">
      <div className=" mx-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Simple code bracket logo */}
          <svg
            className="w-8 h-8 text-indigo-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
          <h1 className="text-2xl font-bold text-orange-500">
            Supa<span className="text-indigo-600">-Code</span>
          </h1>
        </div>
        
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header; 