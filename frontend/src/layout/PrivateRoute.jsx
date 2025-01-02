import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import PropTypes from "prop-types";

const PrivateRoute = ({ children }) => {
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

    return isLoggedIn ? children : <Navigate to="/login" />;
};

PrivateRoute.propTypes = {
    children: PropTypes.element.isRequired,
};

export default PrivateRoute;