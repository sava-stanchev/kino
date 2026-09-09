import { useContext } from "react"
import { Navigate } from "react-router-dom";
import { AuthContext } from "src/utils/AuthContext"

const HomeRedirect = () => {
    const { status } = useContext(AuthContext);
    if (status === "init")
        return null;

    return <Navigate to={status === "authed" ? "/movies" : "/login"} replace />;
}

export default HomeRedirect;