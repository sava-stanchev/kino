import React, { useState } from "react";
import { Card, Container, Form } from "react-bootstrap";
import { SPRING } from "src/common/constants";
import { useNavigate } from "react-router-dom";
import AlertDismissible from "src/components/Alert";
import { AlertDismissibleProps } from "src/types";

interface UserRegisterFormData {
    username: string;
    password: string;
    email: string;
}

const initialState: UserRegisterFormData = {
    username: "",
    password: "",
    email: "",
};

const validationRules: Record<
    keyof UserRegisterFormData,
    (value: string) => boolean
> = {
    email: (value) =>
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
            value
        ),
    username: (value) => value.length >= 3 && value.length <= 20,
    password: (value) => value.length >= 4 && value.length <= 30,
};

const evaluatePasswordStrength = (password: string): string => {
    const conditions = [
        password.length > 8,
        /[a-z]/.test(password),
        /[A-Z]/.test(password),
        /\d/.test(password),
        /[^A-Za-z0-9]/.test(password),
    ];
    const score = conditions.filter(Boolean).length;
    if (score <= 1) return "weak";
    if (score === 2) return "medium";
    return "strong";
};

const Register: React.FC = () => {
    const [newUser, setNewUser] = useState<UserRegisterFormData>(initialState);
    const [errors, setErrors] = useState({
        email: false,
        username: false,
        password: false,
    });
    const [strength, setStrength] = useState<string>("");
    const [alert, setAlert] = useState<AlertDismissibleProps>({active: false, msg: ""});
    const navigate = useNavigate();

    const updateField = (name: keyof UserRegisterFormData, value: string) => {
        setNewUser((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: validationRules[name](value) }));
        if (name === "password") setStrength(evaluatePasswordStrength(value));
    };

    const handleSignUp = async () => {
        try {
            const res = await fetch(`${SPRING}/api/users`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newUser),
            });

            if (!res.ok) {
                const msg = res.status === 409 ? "Username or email already exists" : "Registration failed";
                setAlert({ active: true, msg });
                return;
            }

            navigate("/login", { replace: true });
        } catch (e) {
            console.error("Error signing up:", e);
        }
    };

    const isFormValid = Object.values(errors).every(Boolean);

    return (
        <Container className="py-4 d-flex justify-content-center align-items-center">
            <Card bg="dark" border="secondary" className="shadow-lg" style={{ width: "100%", maxWidth: "400px" }}>
                <Card.Body className="p-3">
                    <Card.Title as="h2" className="text-center mb-4 text-light fw-bold">Sign Up</Card.Title>
                    <Form className="mb-3">
                        <Form.Group className="mb-3">
                            <Form.Label className="text-light fw-semibold">Username</Form.Label>
                            <Form.Control
                                type="text"
                                id="username"
                                placeholder="Enter username"
                                value={newUser.username}
                                onChange={(e) => updateField("username", e.target.value)}
                                className="form-control"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-light fw-semibold">Email</Form.Label>
                            <Form.Control
                                type="email"
                                id="email"
                                placeholder="Enter email"
                                value={newUser.email}
                                onChange={(e) =>
                                    updateField("email", e.target.value)
                                }
                                className="form-control"
                            />
                        </Form.Group>
                        <Form.Group className="mb-4">
                            <Form.Label className="text-light fw-semibold">Password</Form.Label>
                            <Form.Control
                                type="password"
                                id="password"
                                placeholder="Enter password"
                                value={newUser.password}
                                onChange={(e) => updateField("password", e.target.value)}
                                className="form-control"
                            />
                            {newUser.password && (
                                <small className="text-light">
                                    Password strength:{" "}<strong>{strength}</strong>
                                </small>
                            )}
                        </Form.Group>
                        <div className="d-grid gap-2 mt-4">
                            <button type="button" className="btn btn-primary fw-semibold"
                                onClick={handleSignUp} disabled={!isFormValid}>
                                Sign Up
                            </button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>

            {alert.active && (
                <div className="position-fixed top-0 end-0 me-3 mt-5" style={{ zIndex: 1050, maxWidth: "300px" }}>
                    <AlertDismissible active={alert.active} msg={alert.msg}
                        onClose={() => setAlert({active: false, msg: ""})} />
                </div>
            )}
        </Container>
    );
};

export default Register;