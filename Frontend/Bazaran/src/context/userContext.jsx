import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Load user from localStorage on app start
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // Function to update user data
    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData)); // persist user
        localStorage.setItem("token", userData.token); // optional, store token separately
    };

    // Function to clear user data (eg on logout)
    const clearUser = () => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    return (
        <UserContext.Provider
            value={{
                user,
                updateUser,
                clearUser,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
