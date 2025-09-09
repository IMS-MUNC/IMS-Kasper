// components/auth/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Simulate checking for user (e.g., from localStorage)
        const loggedUser = localStorage.getItem("user");
        try {
            if (loggedUser && loggedUser !== "undefined") {
                setUser(JSON.parse(loggedUser));
            }
        }catch(error) {
            console.error("Failed to parse user from localstorage", error)
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for consuming context
export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
