import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const InfraDetails = () => {
  const { stateName } = useParams();
  const [infraDetails, setInfraDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/infraData.json")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        if (data && stateName && data[stateName]) {
          setInfraDetails(data[stateName]);
          setNotFound(false);
        } else {
          setInfraDetails([]);
          setNotFound(true);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching infrastructure data:", err);
        setInfraDetails([]);
        setLoading(false);
        setNotFound(true);
      });
  }, [stateName]);

  if (loading) {
    return (
      <div className="text-center mt-16 text-lg text-gray-800 dark:text-gray-200 animate-pulse">
        Loading infrastructure details for <b>{stateName}</b>...
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="text-center mt-16 text-red-600 dark:text-red-400">
        No infrastructure data found for <b>{stateName}</b>.
      </div>
    );
  }

  return (
    <div className="max-w-3xl w-full mx-auto mt-12 p-6 sm:p-10 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl transition-colors duration-700">
      <h2 className="text-3xl sm:text-4xl font-extrabold mb-8 text-gray-900 dark:text-gray-100 tracking-tight text-center">
        Infrastructure Projects in {stateName}
      </h2>
      {infraDetails.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400">No projects listed.</p>
      ) : (
        <ul className="space-y-8">
          {infraDetails.map(({ name, description, sector }, idx) => (
            <li
              key={idx}
              className="group flex flex-col sm:flex-row items-start justify-between p-6 rounded-xl bg-gray-50 dark:bg-gray-800 shadow-md hover:shadow-2xl hover:bg-blue-50 dark:hover:bg-blue-900 transform hover:-translate-y-2 transition-all duration-400 ease-in-out"
              style={{ animationDelay: `${idx * 120}ms` }}
            >
              <div className="flex-1 pr-0 sm:pr-6 mb-4 sm:mb-0">
                <div className="font-bold text-xl sm:text-2xl text-blue-700 dark:text-blue-300 group-hover:text-blue-900 dark:group-hover:text-blue-200 transition-colors duration-300">
                  {name}
                </div>
                <div className="mt-3 text-gray-700 dark:text-gray-200 text-base sm:text-lg leading-relaxed">
                  {description}
                </div>
                <div className="mt-2 font-semibold text-gray-600 dark:text-gray-400">
                  Sector: {sector}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InfraDetails;
