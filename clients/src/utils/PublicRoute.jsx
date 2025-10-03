// src/utils/PublicRoute.jsx
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // <-- use named import

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 > Date.now()) {
        return <Navigate to="/dashboard" replace />;
      }
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }

  return children;
};

export default PublicRoute;

// old code
// import { Navigate } from "react-router-dom";

// const PublicRoute = ({ children }) => {
//  const user = JSON.parse(localStorage.getItem("user"));
//  return user ? <Navigate to="/dashboard" replace /> : children;
// };

// export default PublicRoute;