import { useContext, useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import decode from "jwt-decode";
import { Card, Container, Form } from "react-bootstrap";
import { SPRING } from "src/common/constants";
import { AuthContext } from "src/utils/AuthContext";
import AlertDismissible from "src/components/Alert";
import { AlertDismissibleProps, User } from "src/types";

const Login: React.FC = () => {
    const navigate = useNavigate();
    const auth = useContext(AuthContext);

    const [formData, setFormData] = useState({ username: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [alert, setAlert] = useState<AlertDismissibleProps>({
        active: false,
        msg: "",
    });

    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const signIn = async () => {
        setAlert({ active: false, msg: "" });

        try {
            const res = await fetch(`${SPRING}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (!res.ok) 
                throw new Error(data.message || "Failed to authenticate");

            localStorage.clear();
            localStorage.setItem("token", data.token);
            const user = decode(data.token) as User;
            auth.setUser(user);
            navigate("/");
        } catch (error: any) {
            console.error(error.message);
            setAlert({ active: true, msg: error.message });
        }
    };

    return (
        <Container className="py-4 d-flex justify-content-center align-items-center">
            <Card bg="dark" border="secondary" className="shadow-lg" style={{ width: "100%", maxWidth: "400px" }}>
                <Card.Body className="p-3">
                    <Card.Title as="h2" className="text-center mb-4 text-light fw-bold">Sign In</Card.Title>        
                    <Form className="mb-3">
                        <Form.Group className="mb-3">
                            <Form.Label className="text-light fw-semibold">Username</Form.Label>
                            <Form.Control
                                type="text"
                                id="username"
                                placeholder="Enter username"
                                value={formData.username}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </Form.Group>
                        <Form.Group className="mb-4 position-relative">
                            <Form.Label className="text-light fw-semibold">Password</Form.Label>
                            <div className="position-relative">
                                <Form.Control
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    placeholder="Enter password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="form-control pe-5"
                                />
                                <button type="button" className="password-eye-icon text-secondary"
                                    onClick={togglePasswordVisibility} aria-label="Toggle password visibility">
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </Form.Group>
                        <div className="d-grid gap-2 mt-4">
                            <button type="button" className="btn btn-primary fw-semibold"
                                onClick={signIn} disabled={!formData.username || !formData.password}>
                                Sign In
                            </button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>

            {alert.active && (
                <div className="position-fixed top-0 end-0 me-3 mt-5" style={{ zIndex: 1050, maxWidth: "300px" }}>
                    <AlertDismissible active={alert.active} msg={alert.msg} />
                </div>
            )}
        </Container>
    );
};

export default Login;
