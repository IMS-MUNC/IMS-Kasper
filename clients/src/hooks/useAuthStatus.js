// import { useEffect } from "react";
// import axiosInstance from "../utils/axiosInstance";
// import {toast} from "react-toastify";

// const useAuthStatus = () => {
//     useEffect(() => {
//         const checkStatus = async () => {
//             try {
//                 const user = JSON.parse(localStorage.getItem("user"));
//                 if(!user?._id) return;
//                 const res = await axiosInstance.get(`/api/user/${user._id}`);

//                 if(res.data.status !== "Active") {
//                     localStorage.removeItem("token");
//                     localStorage.removeItem("user");
//                     localStorage.removeItem("userId");
//                     toast.error("You are currently set Inactive by admin. Please contact admin.");
//                      window.location.href = "/signin";
//                 }
//             }catch(error) {
//                 if(error.response?.status !== 401) {
//                     console.error("Status check error:", error)
//                 }
//             }
//         }
//         const interval = setInterval(checkStatus, 30_000);
//         checkStatus();

//         return () => clearInterval(interval)
//     },[]);
// };

// export default useAuthStatus;





// hooks/useAuthStatus.js
import { useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

const useAuthStatus = () => {
  useEffect(() => {
    const checkStatus = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?._id) return;

      try {
        const res = await axiosInstance.get(`/api/user/${user._id}`);
        if (res.data.status !== "Active") {
          // INSTANTLY REMOVE TOKEN
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("userId");
        }
      } catch (error) {
        // If 401 → token invalid → remove it
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("userId");
        }
      }
    };

    // Check immediately
    checkStatus();

    // Then every 10 seconds
    const interval = setInterval(checkStatus, 10_000);

    return () => clearInterval(interval);
  }, []);
};

export default useAuthStatus;