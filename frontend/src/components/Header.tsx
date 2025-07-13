import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full py-8 px-6 mb-8">
      <div className="max-w-7xl mx-auto">
        <div className="neo-card p-8 text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-600 via-blue-600 to-gray-800 bg-clip-text text-transparent animate-fade-in">
            ISRAFLIGHT
          </h1>
          <p className="text-gray-600 mt-2 text-lg font-medium">
            Real-time Flight Board Management System
          </p>
          <div className="mt-4 h-1 w-32 bg-gradient-to-r from-primary-500 to-blue-500 rounded-full mx-auto animate-pulse"></div>
        </div>
      </div>
    </header>
  );
};

export default Header; 