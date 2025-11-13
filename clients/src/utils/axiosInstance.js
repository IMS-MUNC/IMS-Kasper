// import axios from "axios";
// import {toast}  from "react-toastify";
// import BASE_URL from "../pages/config/config";

// const axiosInstance = axios.create({
//     baseURL:BASE_URL,
// })

// // Request Interceptor (add token)
// axiosInstance.interceptors.request.use((config) => {
//     const token = localStorage.getItem("token");
//     if(token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

// // Response Interceptor (handle 401 & Inactive) 
// axiosInstance.interceptors.response.use((response) => response,(error) => {
//     if(error.response?.status === 401) {
//     const msg = error.response.data?.message || "Session expired";
//     // clear everything
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     localStorage.removeItem("userId");

//     // show message
//     toast.error(msg.includes("Inactive")
//     ? "You are currently set Inactive by admin. Please contact admin." : "Session expired. Please login again"
// );
// // Redirect to login
// window.location.href = "/signin";
//     }
//     return Promise.reject(error);
// })

// export default axiosInstance;


import axios from "axios";
import { toast } from "react-toastify";
import BASE_URL from "../pages/config/config";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// Request Interceptor
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const data = error.response.data;
      const isInactive = data?.message?.includes("Inactive") || data?.logout === true;

      // Clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userId");

      // Show message
      toast.error(
        isInactive
          ? "You are currently set Inactive by admin. Please contact admin."
          : "Session expired. Please login again."
      );

      // Redirect only if not already on signin
      if (window.location.pathname !== "/signin") {
        window.location.href = "/signin";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;