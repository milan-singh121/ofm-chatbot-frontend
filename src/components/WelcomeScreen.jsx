import React from 'react';
import { Sparkles, Upload } from 'lucide-react';

const WelcomeScreen = ({ onUploadClick }) => (
    <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="p-4 bg-gray-200 dark:bg-gray-700 rounded-full mb-6">
            <Sparkles size={40} className="text-indigo-500"/>
        </div>
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200">Fashion Insights AI</h1>
        <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">Upload a CSV or Parquet file to start your analysis.</p>
        <button 
            onClick={onUploadClick}
            className="mt-8 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-6 rounded-lg inline-flex items-center justify-center transition-colors shadow-lg"
        >
            <Upload className="mr-2" />
            <span>Select File</span>
        </button>
    </div>
);

export default WelcomeScreen;
