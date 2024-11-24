import React from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

function Header() {
  const [darkMode, setDarkMode] = React.useState(false);

  React.useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      localStorage.theme = 'light';
      document.documentElement.classList.remove('dark');
    } else {
      localStorage.theme = 'dark';
      document.documentElement.classList.add('dark');
    }
    setDarkMode(!darkMode);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm py-4 transition-colors duration-200">
      <div className="mx-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg
            className="w-8 h-8 text-indigo-600 dark:text-indigo-400"
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
          <h1 className="text-2xl font-bold">
            <span className="text-orange-500 dark:text-orange-400">Supa</span>
            <span className="text-black dark:text-white">Code</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <SunIcon className="h-5 w-5 text-yellow-500" />
            ) : (
              <MoonIcon className="h-5 w-5 text-gray-700" />
            )}
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 dark:bg-indigo-500 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header; 