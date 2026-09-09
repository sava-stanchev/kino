import React, { createContext, useEffect, useMemo, useState } from "react";
import jwtDecode from "jwt-decode";
import { User } from "src/types";

interface AuthContextVal {
    user: User | null;
    status: "init" | "authed" | "unauthed";
    setUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextVal>({
    user: null,
    status: "init",
    setUser: () => {},
});

export const getUser = (): User | null => {
    try {
        const tok = localStorage.getItem("token");
        if (!tok)
            return null;

        const user = jwtDecode<User>(tok);
        if (!user.sub || !user.role || !Number.isFinite(user.exp) || user.exp <= Date.now() / 1000) {
            localStorage.removeItem("token");
            return null;
        }

        return user;
    } catch (e) {
        console.error("Failed to decode token", e);
        localStorage.removeItem("token");
        return null;
    }
};

interface AuthContextProviderProps {
    children: React.ReactNode;
}

const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
    children,
}) => {
    const [user, setUserState] = useState<User | null>(null);
    const [status, setStatus] = useState<"init" | "authed" | "unauthed">("init");

    const setUser = (nextUser: User | null) => {
        setUserState(nextUser);
        setStatus(nextUser ? "authed" : "unauthed");
    };

    useEffect(() => {
        const restoreUser = () => setUser(getUser());
        restoreUser();

        const handleStorageChange = () => restoreUser();
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    const contextVal = useMemo(() => ({ user, status, setUser }), [user, status]);

    return (
        <AuthContext.Provider value={contextVal}>{children}</AuthContext.Provider>
    );
};

export default AuthContextProvider;
