import "src/App.css";
import NavbarComponent from "src/components/Navbar";
import Movies from "src/pages/Movies";
import Login from "src/pages/Login";
import Register from "src/pages/Register";
import MovieDetail from "src/pages/MovieDetail";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Users from "src/pages/Users";
import ProtectedRoutes from "src/utils/ProtectedRoutes";
import Error404 from "src/pages/Error404";
import AuthContextProvider from "src/utils/AuthContext";
import HomeRedirect from "./components/HomeRedirect";

const router = createBrowserRouter([
    {
        element: <NavbarComponent />,
        errorElement: <Error404 />,
        children: [
            {
                path: "/",
                element: <HomeRedirect />,
            },
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/register",
                element: <Register />,
            },
            {
                path: "/movies",
                element: <Movies />,
            },
            {
                path: "/movies/:id",
                element: <MovieDetail />,
            },
            {
                element: <ProtectedRoutes />,
                children: [
                    {
                        path: "/users",
                        element: <Users />,
                    },
                ],
            },
        ],
    },
]);

const App: React.FC = () => {
	return (
		<AuthContextProvider>
			<RouterProvider router={router}></RouterProvider>
		</AuthContextProvider>
	);
};

export default App;
