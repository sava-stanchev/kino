import "src/App.css";
import NavbarComponent from "src/components/Navbar";
import Books from "src/pages/Books";
import Login from "src/pages/Login";
import Register from "src/pages/Register";
import SingleBook from "src/pages/SingleBook";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Users from "src/pages/Users";
import Home from "src/pages/Home";
import ProtectedRoutes from "src/utils/ProtectedRoutes";
import Error404 from "src/pages/Error404";
import AuthContextProvider from "src/utils/AuthContext";

const router = createBrowserRouter([
  {
    element: <NavbarComponent />,
    errorElement: <Error404 />,
    children: [
      {
        path: "/",
        element: <Home />,
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
        path: "/books",
        element: <Books />,
      },
      {
        element: <ProtectedRoutes />,
        children: [
          {
            path: "/books/:id",
            element: <SingleBook />,
          },
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
