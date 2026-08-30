import { useContext } from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { AuthContext } from "src/utils/AuthContext";

const HomePage = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="home-page-background">
            <Link to={user ? "/movies" : "/login"}>
                <Button variant="warning" size="lg">
                    Movies
                </Button>
            </Link>
        </div>
    );
};

export default HomePage;
