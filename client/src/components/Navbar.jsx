import React, { useState, useEffect } from 'react';

const navItems = [
  { name: 'Home' },
  { name: 'Markers' },
  { name: 'Settings' },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    const closeOnResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener('resize', closeOnResize);
    return () => window.removeEventListener('resize', closeOnResize);
  }, []);

  return (
    <>
      {/* Hamburger Button (Mobile Only) */}
      <button
        className="md:hidden fixed top-4 right-4 bg-gray-800 dark:bg-gray-700 text-white p-2 rounded-full shadow-lg z-[9999]"
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
      </button>

      {/* Overlay (Mobile Only, when navbar is open) */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-[9998] md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Navbar */}
      <nav
        className={`
          fixed md:static top-0 right-0
          bg-white dark:bg-gray-950 text-gray-900 dark:text-white
          w-32 md:w-40 h-screen
          flex flex-col items-center md:items-start
          justify-start
          shadow-lg z-[9999]
          transition-transform duration-500
          ${open ? 'translate-x-0' : 'translate-x-full'} md:translate-x-0
          px-4 py-8 md:py-10
        `}
        style={{ minWidth: '8rem' }}
      >
        {/* Close button for mobile */}
        <button
          className="md:hidden absolute top-4 right-4 text-gray-900 dark:text-white"
          onClick={() => setOpen(false)}
          aria-label="Close navigation"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-lg font-extrabold mb-6 text-center md:text-left tracking-tight">
          My Map
        </h2>
        <ul className="space-y-2 md:space-y-3 w-full">
          {navItems.map((item, idx) => (
            <li
              key={item.name}
              className="
                group relative px-2 py-2 rounded-lg
                hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-400
                hover:text-white transition-all duration-300
                cursor-pointer
              "
              style={{ animationDelay: `${idx * 100}ms` }}
              onClick={() => setOpen(false)}
            >
              <span className="relative z-10">{item.name}</span>
              <span className="absolute inset-0 opacity-0 group-hover:opacity-30 bg-blue-500 rounded-lg transition-opacity duration-300"></span>
            </li>
          ))}
        </ul>
        {/* Dark mode button directly after nav links */}
        <button
          onClick={() => setDarkMode((d) => !d)}
          className="
            mt-4
            bg-gray-200 dark:bg-gray-800
            text-gray-900 dark:text-white
            px-3 py-2 rounded-full shadow-lg
            hover:scale-105 hover:bg-blue-600 hover:text-white
            transition-all duration-300
            font-semibold
            w-full
          "
          aria-label="Toggle dark mode"
        >
          {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
        </button>
      </nav>
    </>
  );
};

export default Navbar;
