import axios from "axios";
import Cookies from "js-cookie";

import { BASE_URL } from "./constants";
import {
  isAccessTokenExpired,
  getRefreshToken,
  setAuthUser,
  logout,
} from "./auth";

const useAxios = () => {
  // Create a new Axios instance
  const axiosInstance = axios.create({
    baseURL: BASE_URL,
  });

  // ============== REQUEST INTERCEPTOR ==============
  axiosInstance.interceptors.request.use(
    async (config) => {
      let accessToken = Cookies.get("access_token");
      const refreshToken = Cookies.get("refresh_token");

      // If either token doesn't exist, just send the request without auth
      if (!accessToken || !refreshToken) {
        return config;
      }

      // Check if the current access token is expired
      if (isAccessTokenExpired(accessToken)) {
        try {
          // Attempt to get a new access token using the refresh token
          const { access, refresh } = await getRefreshToken(); 
          // Update cookies & store with the new tokens
          setAuthUser(access, refresh);
          // Update the request headers to include the new token
          config.headers.Authorization = `Bearer ${access}`;
        } catch (error) {
          // If refreshing fails, log out or handle error
          console.error("Error refreshing token:", error);
          logout();
        }
      } else {
        // If not expired, ensure we attach the existing access token
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      return config;
    },
    (error) => {
      // Handle errors from the request interceptor itself
      return Promise.reject(error);
    }
  );

  // (Optional) ============== RESPONSE INTERCEPTOR ==============
  // If you prefer to refresh on a 401 response instead of before every request,
  // you can enable a response interceptor like this:
  /*
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response && error.response.status === 401) {
        const refreshToken = Cookies.get("refresh_token");
        if (refreshToken) {
          try {
            const { access, refresh } = await getRefreshToken();
            setAuthUser(access, refresh);

            // Update original request with the new token and re-send
            error.config.headers.Authorization = `Bearer ${access}`;
            return axiosInstance(error.config);
          } catch (refreshError) {
            console.error("Refresh failed, logging out:", refreshError);
            logout();
          }
        } else {
          logout();
        }
      }
      return Promise.reject(error);
    }
  );
  */

  return axiosInstance;
};

export default useAxios;
