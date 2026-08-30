import { useContext } from "react"
import { Navigate } from "react-router-dom";
import { AuthContext } from "src/utils/AuthContext"

const HomeRedirect = () => {
    const {user} = useContext(AuthContext);
    return <Navigate to={user ? "/movies" : "/login"} replace />;
}

export default HomeRedirect;