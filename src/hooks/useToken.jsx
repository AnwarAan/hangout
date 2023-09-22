import { useState } from "react";
import { useNavigate } from "react-router-dom";

const useToken = () => {
  const navigate = useNavigate();

  const getToken = () => {
    const tokenString = sessionStorage.getItem("token");
    const userToken = JSON.parse(tokenString);
    return userToken?.token;
  };

  const getUserId = () => {
    const tokenString = sessionStorage.getItem("token");
    const userToken = JSON.parse(tokenString);
    return userToken?.id;
  };

  const login = () => {
    const tokenString = sessionStorage.getItem("token");
    const userToken = JSON.parse(tokenString);
    const valid = userToken?.token;
    if (valid) return true;
  };

  // sessionStorage.clear();
  const [token, setToken] = useState(getToken());
  const [userId, setUserId] = useState(getUserId());
  const [isLogin, setIsLogin] = useState(login());

  const saveToken = (userToken) => {
    sessionStorage.setItem("token", JSON.stringify(userToken));
    setToken(userToken.token);
    setUserId(userToken.id);
    setIsLogin(true);
    navigate("/");
    window.location.reload();
  };

  const logout = () => {
    console.log("clik");
    sessionStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };

  // console.log("use", userId);
  return { setToken: saveToken, logout, token, userId, isLogin };
};

export default useToken;
