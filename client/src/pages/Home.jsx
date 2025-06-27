import React from 'react';
import { useNavigate } from 'react-router-dom';

const WeatherSVG = () => (
  <svg width="140" height="140" viewBox="0 0 140 140" fill="none" className="mx-auto mb-4 animate-sunrise">
    <circle cx="70" cy="70" r="40" fill="#FDE68A" />
    <circle cx="70" cy="70" r="28" fill="#FBBF24" />
    <g>
      <ellipse cx="100" cy="90" rx="24" ry="12" fill="#93C5FD" opacity="0.8" />
      <ellipse cx="60" cy="100" rx="30" ry="16" fill="#60A5FA" opacity="0.7" />
    </g>
  </svg>
);

const CloudSVG = ({ className = '', style = {} }) => (
  <svg width="120" height="60" viewBox="0 0 120 60" fill="none" className={className} style={style}>
    <ellipse cx="60" cy="40" rx="40" ry="18" fill="#E0E7EF" />
    <ellipse cx="30" cy="36" rx="18" ry="10" fill="#F1F5F9" />
    <ellipse cx="90" cy="38" rx="16" ry="8" fill="#F1F5F9" />
  </svg>
);

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-br from-sky-200 via-blue-100 to-yellow-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500 overflow-hidden">
      {/* Animated background clouds */}
      <div className="absolute top-10 left-0 w-full flex justify-between pointer-events-none opacity-60 z-0">
        <CloudSVG className="animate-cloud-move" style={{ animationDuration: '28s' }} />
        <CloudSVG className="animate-cloud-move-reverse" style={{ animationDuration: '35s' }} />
      </div>
      {/* Weather SVG icon */}
      <div className="z-10">
        <WeatherSVG />
      </div>
      {/* Welcome Card */}
      <div className="z-10 bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-2xl p-10 max-w-xl text-center animate-fade-in-up">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-blue-700 dark:text-blue-300 drop-shadow-lg tracking-tight animate-fade-in-down">
          Welcome To Mausam Mitra
        </h1>
        <p className="mb-6 text-lg md:text-xl text-gray-700 dark:text-gray-200 font-medium animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          Your interactive portal for real-time weather and climate risk insights across India.
        </p>
        <div className="mb-6 text-left animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <span className="font-semibold block mb-2 text-blue-700 dark:text-blue-200">Features:</span>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-200 space-y-1">
            <li><span role="img" aria-label="cloud">☁️</span> Current weather and forecasts for all Indian state capitals</li>
            <li><span role="img" aria-label="alert">⚡</span> Visualize climate risks with intuitive map markers</li>
            <li><span role="img" aria-label="magnifier">🔎</span> Get detailed weather and risk analysis for any city</li>
            <li><span role="img" aria-label="sparkles">✨</span> Enjoy a beautiful, responsive, and dark-mode enabled experience</li>
          </ul>
        </div>
        <button
          onClick={() => navigate('/weather')}
          className="mt-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-700 hover:to-blue-500 text-white font-bold rounded-full shadow-lg transition-all duration-300 text-xl animate-bounce"
          style={{ animationDelay: '0.4s' }}
        >
          Get Started
        </button>
      </div>
      {/* Animations */}
      <style>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(30px);}
          100% { opacity: 1; transform: translateY(0);}
        }
        @keyframes fade-in-down {
          0% { opacity: 0; transform: translateY(-30px);}
          100% { opacity: 1; transform: translateY(0);}
        }
        @keyframes sunrise {
          0% { opacity: 0; transform: scale(0.7) translateY(40px);}
          100% { opacity: 1; transform: scale(1) translateY(0);}
        }
        @keyframes cloud-move {
          0% { transform: translateX(-10vw);}
          100% { transform: translateX(100vw);}
        }
        @keyframes cloud-move-reverse {
          0% { transform: translateX(100vw);}
          100% { transform: translateX(-10vw);}
        }
        .animate-fade-in-up { animation: fade-in-up 1s cubic-bezier(.39,.575,.565,1.000) both; }
        .animate-fade-in-down { animation: fade-in-down 1s cubic-bezier(.39,.575,.565,1.000) both; }
        .animate-sunrise { animation: sunrise 1.1s cubic-bezier(.39,.575,.565,1.000) both; }
        .animate-bounce { animation: bounce 2s infinite; }
        .animate-cloud-move { animation: cloud-move 32s linear infinite; }
        .animate-cloud-move-reverse { animation: cloud-move-reverse 38s linear infinite; }
      `}</style>
    </div>
  );
};

export default Home;
