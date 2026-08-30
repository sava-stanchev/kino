import { useContext, useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import decode from "jwt-decode";
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
    <div className="d-flex justify-content-center align-items-center flex-fill bg-dark">
      <AlertDismissible active={alert.active} msg={alert.msg} />
      <div className="form-container p-5 rounded bg-light">
        <form>
          <h3 className="text-center">Sign In</h3>
          <div className="mb-4">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Enter Username"
              className="form-control"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password">Password</label>
            <div className="position-relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter Password"
                className="form-control pe-5"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="password-eye-icon"
                onClick={togglePasswordVisibility}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div className="d-grid">
            <button
              type="button"
              className="btn btn-primary"
              onClick={signIn}
              disabled={!formData.username || !formData.password}
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
