import useToken from "@/hooks/useToken";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthPage = ({ children }) => {
  const navigate = useNavigate();
  const { token } = useToken();

  useEffect(() => {
    if (!token) return navigate("/login");
  }, [token]);

  return <div>{children}</div>;
};

export default AuthPage;
