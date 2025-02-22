import SidebarWs from "../components/SidebarWs";
import NavbarUser from "../components/NavbarUser";
import React from "react";



const Workspace = () => {
  return (
    <div className="relative h-screen w-full">
      {/* Navbar (Above Sidebar) */}
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
        <NavbarUser />
      </div>

      {/* Main Content Area (Includes Sidebar) */}
      <div className="flex h-full">
        {/* Sidebar (Under Navbar) */}
        <div className="absolute top-0 left-0 h-full w-60 pt-16 ">
          <SidebarWs />
        </div>

        {/* Content Section (Adjusted to Fit Next to Sidebar) */}
        <div
          className="flex-grow bg-cover bg-center p-4 ml-60"
          
        >
          <div className="mt-16 p-6 text-white font-bold text-3xl">
            Workspace Content Goes Here
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workspace;
