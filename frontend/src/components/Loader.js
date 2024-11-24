import React from 'react';

const Loader = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500 dark:border-indigo-400"></div>
    </div>
  );
};

export default Loader; 