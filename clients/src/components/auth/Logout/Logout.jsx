// src/pages/auth/Logout.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Clear stored login data
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // ✅ Optionally show message
    toast.success("Logout successful!");

    // ✅ Redirect to login page
    navigate("/login");
  }, [navigate]);

  return null; // No UI needed
};

export default Logout;
