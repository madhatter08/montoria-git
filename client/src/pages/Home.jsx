import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { assets } from "../assets/assets"; // Import all images from assets

const images = [assets.heroBg, assets.heroBg2, assets.heroBg3]; // Add hero images from assets

const Home = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-y-auto">
      {/* Navbar */}
      <Navbar />

      {/* Section 1: Hero Section with Slideshow */}
      <section
        className="relative h-screen flex flex-col justify-center items-center text-center bg-cover bg-center transition-all duration-1000"
        style={{ backgroundImage: `url(${images[currentImage]})` }}
      >
        <div className="absolute inset-0 bg-black opacity-40 transition-opacity"></div>

        <motion.p 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-bold font-['League Spartan'] text-white z-10 mt-4"
        >
          MONTORIA
        </motion.p>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-xl sm:text-3xl lg:text-4xl font-light font-['League Spartan'] text-white z-10 mt-2"
        >
          A space for Montessori
        </motion.p>

        {/* Login Button */}
        <motion.a 
          href="/login"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-6 px-8 py-3 text-lg sm:text-xl font-semibold text-white bg-[#9d16be] rounded-full transition duration-300 hover:bg-[#7a0f96] shadow-lg z-10"
        >
          Get Started
        </motion.a>
      </section>

      {/* Section 2: Feature Highlights */}
      <section className="py-16 px-4 sm:px-8 bg-gray-100 text-gray-900">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold font-['League Spartan']">
            Why Choose Montoria?
          </h2>
          <p className="text-lg sm:text-2xl font-light mt-4">
            The ultimate tool for Montessori educators to track and guide student progress effortlessly.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mt-12">
          {/* Feature 1 */}
          <div className="p-6 bg-white rounded-lg shadow-lg text-center">
            <img src={assets.workspace_icon} alt="Feature 1" className="mx-auto w-20" />
            <h3 className="text-xl font-bold mt-4">Progress Workspace</h3>
            <p className="mt-2 text-gray-700">
              Track progress, and manage classrooms effortlessly.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 bg-white rounded-lg shadow-lg text-center">
            <img src={assets.lessonplan_icon} alt="Feature 2" className="mx-auto w-20" />
            <h3 className="text-xl font-bold mt-4">Personalized Learning</h3>
            <p className="mt-2 text-gray-700">
              Easily structure lessons and adjust plans based on student progress.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 bg-white rounded-lg shadow-lg text-center">
            <img src={assets.reportcard_icon} alt="Feature 3" className="mx-auto w-20" />
            <h3 className="text-xl font-bold mt-4">Seamless Reports</h3>
            <p className="mt-2 text-gray-700">
              Generate detailed student reports for tracking progress and achievements.
            </p>
          </div>

          {/* Feature 4 - New Feature */}
          <div className="p-6 bg-white rounded-lg shadow-lg text-center">
            <img src={assets.chatbot_logo} alt="Feature 4" className="mx-auto w-20" />
            <h3 className="text-xl font-bold mt-4">AI Chatbot Assistance</h3>
            <p className="mt-2 text-gray-700">
              Get real-time support and answers using our AI-powered chatbot.
            </p>
          </div>
        </div>
      </section>

       {/* Section 3: About Section */}
       <section className="py-16 px-4 sm:px-8 bg-[#9d16be] text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Image */}
          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <img 
              className="w-full max-w-md lg:max-w-lg shadow-xl rounded-lg"
              src={assets.aboutImage1} 
              alt="Montoria" 
            />
          </motion.div>

          {/* Right Column: Text */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold font-['League Spartan']">
              Reimagine How You Guide and Manage Learning
            </h2>
            <p className="text-lg sm:text-2xl font-light">
              Montoria is a web-based Montessori-inspired student progress tracker designed specifically for guides to efficiently organize, observe, and document every stage of their students' educational journey.
            </p>
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-16">
          {/* Left Column: Text */}
          <motion.div 
            className="space-y-8 text-right"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold font-['League Spartan']">
              Simplify Classroom Management with Montoria
            </h2>
            <p className="text-lg sm:text-2xl font-light">
              Montoria is designed to give admins full control over classroom management, data organization, and educational oversight, streamlining reporting all from one centralized platform.
            </p>
          </motion.div>

          {/* Right Column: Image */}
          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <img 
              className="w-full max-w-md lg:max-w-lg shadow-xl rounded-lg"
              src={assets.aboutImage2} 
              alt="Montoria" 
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
