import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import PropTypes from "prop-types"; // Import PropTypes
import { AppContext } from "../context/AppContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { userData } = useContext(AppContext);
  const location = useLocation();

  if (!userData) {
    return <Navigate to="/login" replace />; // Redirect if not logged in
  }

  if (!allowedRoles.includes(userData.role)) {
    // Redirect to the user's assigned dashboard
    const dashboardRoutes = {
      admin: "/dashboard-admin",
      guide: "/dashboard-guide",
      student: "/dashboard-student",
    };

    return (
      <Navigate
        to={dashboardRoutes[userData.role] || "/"}
        state={{ from: location }}
        replace
      />
    );
  }

  return <Outlet />; // Allow access if authorized
};

ProtectedRoute.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ProtectedRoute;
