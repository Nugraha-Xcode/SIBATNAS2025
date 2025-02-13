import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminArea = ({ children }) => {
  const { user: currentUser } = useSelector((state) => state.auth);

  if (!currentUser.roles.includes("ROLE_ADMIN")) {
    return <Navigate to="/auth/login" />;
  }
  return children;
};

export default AdminArea;
