import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom"; 
import SidebarWs from "../components/SidebarWs";
import NavbarUser from "../components/NavbarUser";
import Progress from "../components/workspace/Progress";
import Class from "../components/workspace/Class"; 
import LessonPlan from "../components/workspace/LessonPlan";
import Curriculum from "../components/workspace/Curriculum";

const Workspace = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation(); // Get the current route

  // Automatically close the sidebar on smaller screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative h-screen w-full flex flex-col">
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
        <NavbarUser />
      </div>

      {/* Main Content */}
      <div className="flex flex-grow">
        {/* Sidebar */}
        <SidebarWs
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          currentRoute={location.pathname}
        />

        {/* Main Content */}
        <div
          className={`flex-grow transition-all duration-300 ${
            isSidebarOpen ? "ml-60" : "ml-16"
          } p-4`}
        >
          <Routes>
            <Route path="/class" element={<Class />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/lesson-plan" element={<LessonPlan />} />
            <Route path="/curriculum" element={<Curriculum />} />
            <Route path="/*" element={<Class />} /> {/* Default route */}
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Workspace;
