import React from 'react';
import { assets } from "../assets/assets"
const AdminNavbar = () => {
  return (
    <div className="w-full h-[106px] relative bg-white shadow-md top-0 z-50">
      <div className="w-full h-5 bg-[#01690a]" />
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8 h-16">
        {/* Logo */}
        <img className="h-20 pt-4 -m-30" src={assets.montoria_home} alt="Logo" />

        {/* Navigation */}
        <div className="hidden md:flex space-x-8">
          <a href="#home" className="text-gray-900 text-lg font-bold hover:text-green-600 pt-4 pl-40 pr-6">HOME</a>
          <a href="#admission" className="text-gray-900 text-lg font-bold hover:text-green-600 pt-4 pl-10 pr-6">ADMISSION</a>
          <a href="#workspace" className="text-gray-900 text-lg font-bold hover:text-green-600 pt-4 pl-10 pr-6">WORKSPACE</a>
          <a href="#montoria" className="text-gray-900 text-lg font-bold hover:text-green-600 pt-4 pl-10 pr-6">MONTORIA AI</a>
        </div>

    
     {/* Responsive Search Bar */}
<div className="relative w-80 mt-5 max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl h-10 flex items-center bg-gray-200 rounded-full border px-4 mx-auto">
  <input 
    type="text" 
    placeholder="Search..." 
    className="w-full bg-transparent outline-none text-gray-700 text-sm md:text-base placeholder-gray-500"
  />
  <img 
    className="w-5 md:w-5 h-5 md:h-5 absolute right-4 cursor-pointer" 
    src={assets.search} 
    alt="Search" 
  />
</div>



      </div>
    </div>
  );
};

export default AdminNavbar;
