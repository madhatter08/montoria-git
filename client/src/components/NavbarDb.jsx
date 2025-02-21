import { assets } from "../assets/assets"
import { useContext } from 'react'
import { AppContext } from "../context/AppContext"
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const NavbarDb = () => {
  const {userData, backendUrl, setUserData, setIsLoggedIn} = useContext(AppContext)
  const displayName = userData.role === "admin" 
    ? userData.roleData?.name?.[0]?.toUpperCase() || "?"
    : userData.roleData?.firstName?.[0]?.toUpperCase() || "?";
  const navigate = useNavigate();

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + "/api/auth/logout");
      data.success && setIsLoggedIn(false);
      data.success && setUserData(false);
      navigate('/');
    } catch (error) {
      toast.error(error.message);
    }
  }
  
  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">
      <img src={assets.montoria_home} alt="montoria logo" className="w-36 sm:w-40" />
        <div className="w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group">
          {displayName}
          <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10">
            <ul className="list-none m-0 p-2 bg-gray-100 text-sm">
              {/* <li className='py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10'>Profile</li> */}
              <li onClick={logout} className='py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10'>Logout</li>
            </ul>
          </div>
        </div>
    </div>
  )
}

export default NavbarDb