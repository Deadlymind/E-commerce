import { useAuthStore } from "../store/auth";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

// Base URL for your Django backend
const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000/api/v1";
console.log("API Base URL:", BASE_URL);


// ===================== LOGIN =====================
export const login = async (email, password) => {
    try {
        const { data, status } = await axios.post(`${BASE_URL}/user/token/`, { email, password });
        if (status === 200) {
            setAuthUser(data.access, data.refresh);
        }
        return { data, error: null };
    } catch (error) {
        return {
            data: null,
            error: error?.response?.data?.detail || "Something went wrong",
        };
    }
};

// ===================== REGISTER =====================
export const register = async (full_name, email, phone, password, password2) => {
    try {
      // Fetch CSRF token for Django (only if you're actually using session-based CSRF)
    const csrfToken = Cookies.get("csrftoken");

    const { data } = await axios.post(
        `${BASE_URL}/user/register/`,
        { full_name, email, phone, password, password2 },
        { headers: { "X-CSRFToken": csrfToken } }
    );
    // Automatically log in after registration
    await login(email, password);

    return { data, error: null };
    } catch (error) {
      // Log the entire response to see if Django gave us field-level errors
    console.error("Registration error details:", error?.response?.data);

    return {
        data: null,
        // If DRF returns something like {email: ["This field must be unique."]}
        // or {phone: ["This field is required."]}, let's include that
        error: error?.response?.data || "Something went wrong",
    };
    }
};


// ===================== LOGOUT =====================
export const logout = () => {
    // Remove tokens from cookies
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    // Reset user state
    useAuthStore.getState().setUser(null);
};

// ===================== SET AUTH USER =====================
export const setAuthUser = (accessToken, refreshToken) => {
    // Securely store tokens in cookies
    const isSecure = window.location.protocol === "https:";
    Cookies.set("access_token", accessToken, { expires: 7, secure: isSecure });
    Cookies.set("refresh_token", refreshToken, { expires: 30, secure: isSecure });

    // Decode the token to get user info
    const user = jwtDecode(accessToken) || null;

    if (user) {
        // Update Zustand store with user data
        useAuthStore.getState().setUser(user);
    }

    // Indicate loading is complete
    useAuthStore.getState().setLoading(false);
};

// ===================== REFRESH TOKEN =====================
export const getRefreshToken = async () => {
    const refreshToken = Cookies.get("refresh_token");
    if (!refreshToken) {
        throw new Error("No refresh token found");
    }

    const { data } = await axios.post(`${BASE_URL}/user/token/refresh/`, { refresh: refreshToken });
    return data; // Typically contains the new access token
};

// ===================== CHECK TOKEN EXPIRATION =====================
export const isAccessTokenExpired = (accessToken) => {
    try {
        const decodedToken = jwtDecode(accessToken);
        // exp in JWT is in seconds, Date.now() is in milliseconds
        return decodedToken.exp < Math.floor(Date.now() / 1000);
    } catch (error) {
        console.error("Invalid or expired access token:", error);
        return true; // Treat invalid tokens as expired
    }
};

// ===================== SET USER =====================
export const setUser = async () => {
    const accessToken = Cookies.get("access_token");
    const refreshToken = Cookies.get("refresh_token");

    if (!accessToken || !refreshToken) return;

    if (isAccessTokenExpired(accessToken)) {
        try {
            const { access } = await getRefreshToken();
            setAuthUser(access, refreshToken);
        } catch (error) {
            console.error("Error refreshing token:", error);
            logout();
        }
    } else {
        setAuthUser(accessToken, refreshToken);
    }
};

// ===================== MONITOR TOKEN EXPIRATION =====================
export const monitorTokenExpiry = () => {
    setInterval(() => {
        const accessToken = Cookies.get("access_token");
        if (isAccessTokenExpired(accessToken)) {
            console.warn("Access token expired. Logging out...");
            logout();
        }
    }, 60000); // Check every minute
};

// ===================== INITIALIZATION =====================
export const initializeAuth = async () => {
    await setUser();
    monitorTokenExpiry();
};
