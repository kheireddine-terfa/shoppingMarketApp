import React from 'react';

const Category = ({ title, imageSrc, onClick }) => {
  return (
    <div 
      className="bg-zinc-100 text-center h-40 cursor-pointer"
      onClick={onClick}
    >
      <img src={imageSrc} alt={title} className="mx-auto h-full object-cover h-20" />
      <h3 className="mt-2 text-lg md:text-xl lg:text-2xl">{title}</h3>
    </div>
  );
};

export default Category;
