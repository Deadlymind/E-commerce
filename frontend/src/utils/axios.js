import axios from "axios";

const apiInstance = axios.create({
    baseURL: "http://127.0.0.1:8000/api/v1/",
    timeout: 5000,

    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
});

// Add a request interceptor to include the token
apiInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken"); // Retrieve token from local storage
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

apiInstance.interceptors.response.use(
    (response) => response, // Success response
    (error) => {
        // Handle errors here (e.g., logging out the user on a 401 Unauthorized error)
        if (error.response?.status === 401) {
            // For example, redirect to login or handle token expiration
            console.log("Unauthorized, logging out...");
            // Logic for logging out or refreshing the token
        }
        return Promise.reject(error); // Return the error so it can be handled in the request
    }
);


export default apiInstance