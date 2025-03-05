import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        const expiration = localStorage.getItem("session_expiration");

        if (storedUser && expiration) {
            const now = new Date().getTime();
            if (now > Number(expiration)) {
                localStorage.removeItem("user");
                localStorage.removeItem("session_expiration");
                return null;
            }
            return JSON.parse(storedUser);
        }

        return null;
    });

    useEffect(() => {
        if (user) {
            const expirationTime = new Date().getTime() + 30 * 60 * 1000;
            localStorage.setItem("session_expiration", expirationTime);
        }
    }, [user]);

    const login = (userData) => {
        const expirationTime = new Date().getTime() + 30 * 60 * 1000;
        setUser(userData);
        console.log('userData', userData);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("session_expiration", expirationTime);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("session_expiration");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
