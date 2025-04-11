import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import CribbUp from "../../Api/CribbupApi";

const AuthContext = createContext();
function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {

        async function fetchUser() {
            if (!token) {
                setCurrentUser(null);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const decodedToken = jwtDecode(token); //Ensure token is valid

                const userData = await CribbUp.getUser(decodedToken.username);

                setCurrentUser(userData);
                setLoading(false);

            } catch (error) {
                console.error("Error fetching user:", error);
                logout();
            }
        }

        fetchUser();
    }, [token]);

    function login(newToken) {
        if (!newToken) {
            return;
        }
        try {
            localStorage.setItem("token", newToken);
            setToken(newToken);
            navigate("/");
        } catch (error) {
            setError(error)
        };
    }

    // Allows user to sign up.
    function signup(userData) {
        CribbUp.signup(userData)
            .then((newToken) => {

                setToken(newToken);
                localStorage.setItem("token", newToken);
                navigate("/");
            })
            .catch((error) => {
                setError(error)
                console.error("Signup failed:", error);
            });
    }

    function logout() {

        setToken(null);
        setCurrentUser(null);
        localStorage.removeItem("token");
        navigate("/login");
    }

    return (
        <AuthContext.Provider value={{ currentUser, setCurrentUser, token, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export { AuthContext, AuthProvider }; 
