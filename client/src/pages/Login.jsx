//import React from 'react'
import { useContext, useState } from 'react'
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContext);
  const [schoolId, setSchoolId] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      axios.defaults.withCredentials = true;
      
      const { data } = await axios.post(backendUrl + "/api/auth/login", { schoolId, password });

      if (data.success) {
        setIsLoggedIn(true);
        getUserData();

        if (data.role === "admin") {
          navigate("/dashboard-admin");
        } else if (data.role === "guide") {
          navigate("/dashboard-guide");
        } else if (data.role === "student") {
          navigate("/dashboard-student");
        } else {
          toast.error("Invalid user");
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }
  const handleEmailClick = () => {
    const recipient = "montoria.montessori@gmail.com";
    const subject = "Having Trouble Accessing My Account";
    const body = `Hello,\n\nI am experiencing issues accessing my account. Here are my details:
                  \n- School ID: [Your School ID]\n- Issue Description: [Brief description of the issue]\n- Steps Taken: [Any steps you tried to resolve the issue]
                  \n\nPlease assist me in resolving this matter.
                  \n\nThank you,\n[Your Name]`;

    const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Open the email client with the mailto link
    window.location.href = mailtoLink;
  };
  return (
    <div className='flex items-center justify-center min-h-screen bg-cover px-6 sm:px-0' style={{ backgroundImage: `url(${assets.login_bg})`, backgroundPosition: "center 50%", }}>
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">
        <img onClick={() => navigate("/")} src={assets.montoria_home} alt="montoria logo" className='absolute left-5 sm:left-20 top-5 w-36 sm:w-48 hover:scale-110 cursor-pointer transition-all' />
      </div>

      <div className="relative z-10 w-full flex flex-col items-center">
      <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
        <h2 className='text-3xl font-semibold text-white text-center mb-3'>Login</h2>
        <p className='text-center text-sm mb-10'>Login to your account</p>

        <form onSubmit={onSubmitHandler}>
          <div className="relative">
            <label className="relative block">
              <input required onChange={e => setSchoolId(e.target.value)} value={schoolId} type="text" 
                className="px-14 py-3 text-sm outline-none border-2 rounded-full hover:border-green-400 duration-200 peer focus:border-green-400 w-full" 
              />
              <img src={assets.person_icon} alt="person icon" className="absolute left-4 top-1/2 transform -translate-y-1/2 px-2 ml-1"/>
              <span className="absolute left-10 top-1/2 transform -translate-y-1/2 px-2 text-sm tracking-wide peer-focus:text-green-400 pointer-events-none duration-200 peer-focus:text-sm bg-gray-900 peer-focus:-translate-y-8 ml-2 transition-all peer-valid:text-sm peer-valid:-translate-y-8">
                School ID
              </span>
            </label>
            
            <label className="relative block mt-4">
              <input required onChange={e => setPassword(e.target.value)} value={password} type="password" 
                className="px-14 py-3 text-sm outline-none border-2 rounded-full hover:border-green-400 duration-200 peer focus:border-green-400 w-full" 
              />
              <img src={assets.lock_icon} alt="lock icon" className="absolute left-4 top-1/2 transform -translate-y-1/2 px-2 ml-1"/>
              <span className="absolute left-10 top-1/2 transform -translate-y-1/2 px-2 text-sm tracking-wide peer-focus:text-green-400 pointer-events-none duration-200 peer-focus:text-sm bg-gray-900 peer-focus:-translate-y-8 ml-2 transition-all peer-valid:text-sm peer-valid:-translate-y-8">
                Password
              </span>
            </label>
          </div>
          
          {/* 
          <div className='mb-4 mt-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C] outline-none border-2 hover:border-green-400 duration-200'>
            <img src={assets.person_icon} alt="person icon" />
            <input onChange={e => setSchoolId(e.target.value)}
                  value={schoolId} className='bg-transparent outline-none peer focus:border-green-400 text-white' type="text" placeholder="School ID" required  />
          </div>

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C] outline-none border-2 hover:border-green-400 duration-200'>
            <img src={assets.lock_icon} alt="lock icon" />
            <input onChange={e => setPassword(e.target.value)}
                  value={password} className='bg-transparent outline-none text-white' type="password" placeholder="Password" required  />
          </div> */}

          <p onClick={() => navigate("/reset-password")} className='mb-5 mt-2 pl-3 text-indigo-500 cursor-pointer'>Forgot password?</p>

          <button className='w-full mt-2 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium'>Login</button>

          <p className='text-gray-400 text-center text-xs mt-4'>Can&apos;t access your account? {' '}
          <span onClick={handleEmailClick} className='text-blue-400 cursor-pointer underline'>Contact us</span></p>
        </form>
        </div>
      </div>
    </div>
  )
}

export default Login