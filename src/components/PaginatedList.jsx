// /frontend/src/components/PaginatedList.jsx

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const PaginatedList = ({ listData }) => {
  const [visibleRows, setVisibleRows] = useState(10);
  const { title, headers, rows } = listData;

  const showMore = () => {
    setVisibleRows(prev => Math.min(prev + 10, rows.length));
  };

  return (
    <div className="mt-4 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <h3 className="text-md font-semibold p-3 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
        {title}
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              {headers.map((header, index) => (
                <th key={index} className="px-4 py-2 font-medium text-gray-600 dark:text-gray-300">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, visibleRows).map((row, rowIndex) => (
              <tr key={rowIndex} className="border-t border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-4 py-2">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {visibleRows < rows.length && (
        <div className="p-2 border-t border-gray-200 dark:border-gray-700 text-center">
          <button
            onClick={showMore}
            className="w-full text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-md flex items-center justify-center gap-1"
          >
            <ChevronDown size={16} />
            Load More ({rows.length - visibleRows} remaining)
          </button>
        </div>
      )}
    </div>
  );
};

export default PaginatedList;
