import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const PastEventDetails = () => {
  const { state } = useParams();
  const [disasterData, setDisasterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('/disasters.json')
      .then((res) => res.json())
      .then((data) => {
        const normalizedParam = decodeURIComponent(state).trim().toLowerCase();
        const stateData = data.find(
          (item) =>
            item.state &&
            item.state.trim().toLowerCase() === normalizedParam
        );
        if (stateData) {
          setDisasterData(stateData);
          setNotFound(false);
        } else {
          setNotFound(true);
        }
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [state]);

  if (loading) {
    return (
      <div className="text-center mt-16 text-lg text-gray-800 dark:text-gray-200 animate-pulse">
        Loading...
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="text-center mt-16 text-red-600 dark:text-red-400">
        No disaster data found for <b>{decodeURIComponent(state)}</b>.
      </div>
    );
  }

  return (
    <div className="max-w-3xl w-full mx-auto mt-12 p-6 sm:p-10 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl transition-colors duration-700">
      <h2 className="text-3xl sm:text-4xl font-extrabold mb-8 text-gray-900 dark:text-gray-100 tracking-tight text-center">
        Past Natural Disasters in {disasterData?.state || decodeURIComponent(state)}
      </h2>
      <ul className="space-y-8">
        {disasterData.recent_disasters.map((event, idx) => (
          <li
            key={idx}
            className="group flex items-start justify-between p-6 rounded-xl bg-gray-50 dark:bg-gray-800 shadow-md hover:shadow-2xl hover:bg-blue-50 dark:hover:bg-blue-900 transform hover:-translate-y-2 transition-all duration-400 ease-in-out animate-fadeInUp"
            style={{ animationDelay: `${idx * 120}ms` }}
          >
            <div className="flex-1 pr-4">
              <div className="font-bold text-xl sm:text-2xl text-blue-700 dark:text-blue-300 group-hover:text-blue-900 dark:group-hover:text-blue-200 transition-colors duration-300">
                {event.event}
              </div>
              <div className="mt-3 text-gray-700 dark:text-gray-200 text-base sm:text-lg leading-relaxed">
                {event.description}
              </div>
            </div>
            <a
              href={event.link}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-4 flex-shrink-0 flex items-center justify-center rounded-full p-2 hover:bg-blue-100 dark:hover:bg-blue-800 transition"
              title="Read more about this event"
            >
              {/* Arrow up-right SVG icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 text-blue-600 dark:text-blue-300 group-hover:text-blue-900 dark:group-hover:text-blue-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M7 7h10v10" />
              </svg>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PastEventDetails;
