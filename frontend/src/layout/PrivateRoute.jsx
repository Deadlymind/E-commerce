// ===================== IMPORTS =====================
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import PropTypes from "prop-types";

// ===================== COMPONENT: PRIVATEROUTE =====================
/**
 * PrivateRoute:
 * Wrap this component around any route (or component) that should be accessible
 * only if the user is logged in. Otherwise, it redirects to "/login".
 */
const PrivateRoute = ({ children }) => {
  // Access the `isLoggedIn` boolean from our auth store (Zustand)
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  // If the user is logged in, render `children`; otherwise, navigate to /login
  return isLoggedIn ? children : <Navigate to="/login" />;
};

// ===================== PROP TYPES =====================
PrivateRoute.propTypes = {
  /**
   * children: the protected React element(s) this route should render 
   * if the user is authenticated.
   */
  children: PropTypes.element.isRequired,
};

export default PrivateRoute;
