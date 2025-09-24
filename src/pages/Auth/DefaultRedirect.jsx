import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const DefaultRedirect = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const role = user?.profile?.role || user?.user_metadata?.role;

  if (role === "psychologist") {
    return <Navigate to="/psychologist-home" replace />;
  } else if (role === "admin") {
    return <Navigate to="/admin" replace />;
  } else {
    return <Navigate to="/home" replace />;
  }
};

export default DefaultRedirect;
