import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Papa from 'papaparse';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const csvUrl = '/demographicData.csv';

const RELIGION_COLORS = [
  "#FFA500", // Hindu - Orange
  "#00FF00", // Muslim - Green
  "#3F00FF", // Christian - Indigo
  "#FFD700", // Buddhist - Gold
  "#FF1493", // Sikhs - Pink
  "#808080", // Others - Gray
];

const getReligionData = (data) => [
  { name: "Hindu", value: parseFloat(data.Hindu) || 0 },
  { name: "Muslim", value: parseFloat(data.Muslim) || 0 },
  { name: "Christian", value: parseFloat(data.Christian) || 0 },
  { name: "Buddhist", value: parseFloat(data.Buddhist) || 0 },
  { name: "Sikhs", value: parseFloat(data.Sikhs) || 0 },
  { name: "Others", value: parseFloat(data.Others) || 0 },
];

const formatNum = (n) =>
  n && !isNaN(n) ? Number(n).toLocaleString('en-IN') : n || 'N/A';

const DemographicDetails = () => {
  const { state } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Detect dark mode
  const [isDark, setIsDark] = useState(
    () => document.documentElement.classList.contains('dark')
  );
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Normalize state names for matching
  const normalize = (str) =>
    (str || '').trim().toLowerCase().replace(/&/g, 'and').replace(/\s+/g, ' ');

  useEffect(() => {
    setLoading(true);
    fetch(csvUrl)
      .then((response) => response.text())
      .then((csvText) => {
        const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
        const match = parsed.data.find(
          (row) => normalize(row['States/Uts']) === normalize(state)
        );
        setData(match || null);
        setLoading(false);
      });
  }, [state]);

  if (loading) return <div className="text-center py-10 text-lg font-semibold animate-pulse">Loading...</div>;
  if (!data)
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">Demographic Details</h2>
        <div className="text-red-500">No data found for "{state}"</div>
      </div>
    );

  const religionData = getReligionData(data);

  return (
    <motion.div
      className={`px-4 py-2 sm:p-4 max-w-5xl mx-auto rounded-2xl shadow-xl mt-4 sm:mt-8
        ${isDark
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 border-gray-700"
          : "bg-white bg-opacity-90 text-gray-900 border-gray-200"}
        border animate-fade-in-up`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <motion.h2
        className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold mb-2 tracking-tight text-center break-words"
        style={{ wordBreak: 'break-word', lineHeight: 1.2 }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {data['States/Uts']}
      </motion.h2>
      <motion.div
        className="flex flex-col md:flex-row gap-6 md:gap-8 items-center justify-between mt-4 sm:mt-6 w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {/* Responsive Pie Chart */}
        <div className="flex flex-col items-center w-full md:w-1/2 min-w-0">
          <div className="w-full min-w-[140px] max-w-[320px] sm:max-w-[360px] md:max-w-[400px] aspect-square">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart aria-label="Religion distribution pie chart">
                <Pie
                  data={religionData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius="80%"
                  innerRadius="60%"
                  labelLine={false}
                  isAnimationActive
                >
                  {religionData.map((entry, idx) => (
                    <Cell
                      key={`cell-${idx}`}
                      fill={RELIGION_COLORS[idx % RELIGION_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => {
                    if (typeof value === 'number') {
                      return `${(value * 100).toFixed(1)}%`;
                    }
                    return value;
                  }}
                  contentStyle={{
                    background: isDark ? "#23253a" : "#fff",
                    color: isDark ? "#FFA500" : "#23253a",
                    borderRadius: "0.5rem",
                    border: "none",
                    boxShadow: "0 2px 12px 0 rgba(0,0,0,0.25)",
                  }}
                  itemStyle={{
                    color: isDark ? "#FFA500" : "#23253a",
                  }}
                  labelStyle={{
                    color: isDark ? "#fff" : "#23253a",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Custom Legend BELOW the chart */}
          <div className="flex flex-wrap justify-center gap-2 mt-4 w-full">
            {religionData.map((entry, idx) => (
              <span
                key={entry.name}
                className={`flex items-center space-x-1 text-xs font-semibold px-2 py-1 rounded-full transition-colors duration-200
                  ${isDark ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"}
                `}
                style={{ color: RELIGION_COLORS[idx % RELIGION_COLORS.length] }}
              >
                <span
                  className="inline-block w-4 h-4 rounded-full mr-1"
                  style={{ backgroundColor: RELIGION_COLORS[idx % RELIGION_COLORS.length] }}
                />
                {entry.name}
                <span className="ml-1 font-normal text-xs" style={{ color: isDark ? "#e0e0e0" : "#555" }}>
                  {`${(entry.value * 100).toFixed(1)}%`}
                </span>
              </span>
            ))}
          </div>
        </div>
        {/* Table */}
        <div className="w-full md:w-1/2 min-w-0 overflow-x-auto mt-6 md:mt-0">
          <motion.table
            className={`w-full text-left rounded-xl overflow-hidden shadow
              ${isDark
                ? "bg-gray-800 text-gray-100"
                : "bg-gray-50 text-gray-900"}
            `}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <tbody>
              {[
                ["Population (2024)", formatNum(data['population(2024)'])],
                ["Area (sq. km)", formatNum(data['Area (sq. km)'])],
                ["Sex Ratio", data['sex ratio'] || 'N/A'],
                ["GDP (₹ lakh crore)", formatNum(data['GDP'])],
                ["Per Capita Income", formatNum(data['per capita in'])],
                ["Male Literacy Rate (%)", data['Male(literacy rate)'] || 'N/A'],
                ["Female Literacy Rate (%)", data['Female (literacy rate)'] || 'N/A'],
                ["Average Literacy Rate (%)", data['average (literacy rate)'] || 'N/A'],
                ["Majority Religion", data['Majority'] || 'N/A'],
                ["Languages", data['Language'] || 'N/A'],
              ].map(([label, value], idx) => (
                <tr key={label} className={idx % 2 === 0 ? (isDark ? "bg-gray-900" : "bg-white") : ""}>
                  <th className="pr-2 py-2 font-semibold whitespace-nowrap sticky left-0 z-10 bg-inherit">{label}</th>
                  <td className="py-2">{value}</td>
                </tr>
              ))}
            </tbody>
          </motion.table>
        </div>
      </motion.div>
      {/* Divider */}
      <div className="my-6 border-t border-gray-300 dark:border-gray-700" />
      {/* Animated bottom bar */}
      <motion.div
        className={`py-4 px-4 sm:px-6 rounded-lg shadow-lg text-center font-semibold text-lg tracking-wide
          ${isDark ? "bg-indigo-800 text-indigo-100" : "bg-indigo-50 text-indigo-900"}
        `}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <span>
          <span className="font-bold">{data['States/Uts']}</span> is a vibrant region of India with a unique demographic and cultural profile.
        </span>
      </motion.div>
    </motion.div>
  );
};

export default DemographicDetails;
