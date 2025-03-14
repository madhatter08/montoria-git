// client/src/context/AppContext.jsx
import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  axios.defaults.withCredentials = true;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getAuthState = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`);
      console.log("Auth state response:", data);
      if (data.success) {
        setIsLoggedIn(true);
        await getUserData();
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
    } catch (error) {
      console.error("Error checking auth state:", {
        message: error.message,
        response: error.response?.data,
      });
      setIsLoggedIn(false);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  const getUserData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/user/data`);
      console.log("User data response:", data);
      if (data.success) {
        // Normalize schoolid to schoolId
        const normalizedUserData = {
          ...data.userData,
          schoolId: data.userData.schoolid || data.userData.schoolId, // Handle both cases
        };
        console.log("Normalized userData:", normalizedUserData);
        setUserData(normalizedUserData);
      } else {
        setUserData(null);
        toast.error(data.message || "Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", {
        message: error.message,
        response: error.response?.data,
      });
      setUserData(null);
      toast.error("Failed to fetch user data. Please log in again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);

  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
    loading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

AppContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};