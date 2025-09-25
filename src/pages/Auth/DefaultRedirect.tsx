import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Loading from "../Loading/Loading";

const DefaultRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const role = user?.profile?.role;

  if (role === "psychologist") {
    return <Navigate to="/psychologist-dashboard" replace />;
  } else if (role === "admin") {
    return <Navigate to="/admin" replace />;
  } else {
    return <Navigate to="/dashboard" replace />;
  }
};

export default DefaultRedirect;
