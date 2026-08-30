import { useContext } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "src/utils/AuthContext";

const useSignOut = (): (() => Promise<void>) => {
    const navigate = useNavigate();
    const auth = useContext(AuthContext);

    const signOut = async (): Promise<void> => {
        try {
            auth.setUser(null);
            localStorage.removeItem("token");
            navigate("/");
        } catch (error) {
            console.error((error as Error).message);
        }
    };

    return signOut;
};

const NavbarComponent: React.FC = () => {
    const { user } = useContext(AuthContext);
    const signOut = useSignOut();

    return (
        <>
        <Navbar
            bg="dark"
            data-bs-theme="dark"
            collapseOnSelect
            expand="lg"
            fixed="top"
        >
            <Container>
            <Navbar.Brand as={Link} to="/">
                BooksDB
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto">
                <Nav.Link as={Link} to="/">
                    Home
                </Nav.Link>
                </Nav>
                <Nav>
                {user ? (
                    <>
                    {user.role === "ROLE_ADMIN" && (
                        <Nav.Link as={Link} to="/users">
                        Users
                        </Nav.Link>
                    )}
                    <Nav.Link as={Link} to="/books">
                        Books
                    </Nav.Link>
                    <Nav.Link onClick={signOut}>Log Out</Nav.Link>
                    </>
                ) : (
                    <>
                    <Nav.Link as={Link} to="/login">
                        Login
                    </Nav.Link>
                    <Nav.Link as={Link} to="/register">
                        Register
                    </Nav.Link>
                    </>
                )}
                </Nav>
            </Navbar.Collapse>
            </Container>
        </Navbar>
        <Outlet />
        </>
    );
};

export default NavbarComponent;
