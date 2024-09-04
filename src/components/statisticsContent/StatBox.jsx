import React from 'react';

const StatBox = ({ iconColor, bgColor, title, daily,monthly, iconPath }) => {
  return (
    <div className=" h-24 flex items-center px-5 py-6  rounded-md bg-white shadow-xl">
      <div className={`w-12 p-3 rounded-full ${bgColor} bg-opacity-75 `}>
        <svg className={`mt-4 ml-0 h-10 w-10 ${iconColor}`} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          {iconPath}
        </svg>
      </div>
      <div className="mx-5">
        <h4 className="text-2xl font-semibold text-gray-700">{title}</h4>
        <div className="text-gray-500">ce jour : <span className='font-semibold'>{daily}</span></div>
        <div className="text-gray-500">ce mois : <span className='font-semibold'>{monthly}</span></div>
      </div>
    </div>
  );
};

export default StatBox;
