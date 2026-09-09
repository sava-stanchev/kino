import { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const ProtectedRoutes: React.FC = () => {
    const { status } = useContext(AuthContext);
    if (status === "init")
        return null;

    return status === "authed" ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoutes;
