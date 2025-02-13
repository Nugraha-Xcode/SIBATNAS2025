import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const LoggedArea = ({ children }) => {
  const { user: currentUser } = useSelector((state) => state.auth);

  if (!currentUser) {
    return <Navigate to="/auth/login" />;
  }
  return children;
};

export default LoggedArea;
