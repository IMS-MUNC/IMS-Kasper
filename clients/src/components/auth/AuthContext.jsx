// components/auth/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios"
import BASE_URL from "../../pages/config/config";
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

    //refresh user from backend
    const refreshUser = async () => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser || storedUser === "undefined") return;
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
            const response = await axios.get(`${BASE_URL}/api/user/userdata/${parsedUser._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUser(response.data);
            localStorage.setItem("user", JSON.stringify(response.data));
        } catch (error) {
            console.error("Failed to refresh user data", error);
        }
    }

    return (
        <AuthContext.Provider value={{ user, setUser, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for consuming context
export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
