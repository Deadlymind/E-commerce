import { useAuthStore } from "../store/auth";

import axios from "axios";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";

// ===================== LOGIN =====================

export const login = async (email, password) => {
    try {
    const { data, status } = await axios.post("user/token/", { email, password });

    if (status === 200) {
    setAuthUser(data.access, data.refresh);
    // Alert - Signed In Successfully
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
    const { data } = await axios.post("user/register/", {
    full_name,
    email,
    phone,
    password,
    password2,
    });
    // Automatically log in after registration
    await login(email, password);
    // Alert - Signed Up Successfully

    return { data, error: null };
    } catch (error) {
    return {
    data: null,
    error: error?.response?.data?.detail || "Something went wrong",
    };
    }
};

// ===================== LOGOUT =====================

export const logout = () => {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    useAuthStore.getState().setUser(null);

  // Alert - Logged Out Successfully
};

// ===================== SET USER =====================
// This function is typically called on app start or page refresh
export const setUser = async () => {
    const accessToken = Cookies.get("access_token");
    const refreshToken = Cookies.get("refresh_token");

  // If no tokens exist, do nothing
    if (!accessToken || !refreshToken) return;

  // If token is expired, attempt to refresh
    if (isAccessTokenExpired(accessToken)) {
    try {
    const { access } = await getRefreshToken();
    setAuthUser(access, refreshToken);
    } catch (error) {
    // If refreshing fails, log the user out
    console.error("Error refreshing token:", error);
    logout();
    }
    } else {
    setAuthUser(accessToken, refreshToken);
    }
};

// ===================== SET AUTH USER =====================
export const setAuthUser = (accessToken, refreshToken) => {
    // Store tokens in cookies
    // Note: { secure: true } means cookies require HTTPS
    Cookies.set("access_token", accessToken, { expires: 7, secure: true });
    Cookies.set("refresh_token", refreshToken, { expires: 30, secure: true });

    // Decode the token to get user info
    const user = jwt_decode(accessToken) || null;

    if (user) {
    // Update the auth store with the new user
    useAuthStore.getState().setUser(user);
    }

    // Indicate loading is complete
    useAuthStore.getState().setLoading(false);

    // Alert - Logged In Successfully
};

// ===================== REFRESH TOKEN =====================
export const getRefreshToken = async () => {
    // We grab the refresh token from cookies
    const refreshToken = Cookies.get("refresh_token");

    if (!refreshToken) {
    throw new Error("No refresh token found");
    }

    // Make an API call to refresh
    const response = await axios.post("user/token/refresh/", {
    refresh: refreshToken,
    });

    // The response typically contains the new access token
    return response.data;
};

// ===================== CHECK TOKEN EXPIRATION =====================
export const isAccessTokenExpired = (accessToken) => {
    try {
    const decodedToken = jwt_decode(accessToken);
    // exp in JWT is in *seconds*; Date.now() is in *milliseconds*
    return decodedToken.exp < Math.floor(Date.now() / 1000);
    } catch (error) {
    console.error("Error decoding access token:", error);
    // If decoding fails, treat it as expired
    return true;
    }
};
