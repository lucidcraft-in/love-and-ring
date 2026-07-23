import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const user = localStorage.getItem("user");

  // If there's no user, redirect to the login page
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;