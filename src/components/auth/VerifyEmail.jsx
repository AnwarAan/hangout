import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import verifyEmail from "@/services";
import { useQuery } from "@tanstack/react-query";
import { getAPI } from "@/api/api";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const userId = searchParams.get("userId");
  const navigate = useNavigate();

  const { data: user, isFetched } = useQuery(["user"], async () => {
    const res = await getAPI(`user/${userId}`);
    return res.data;
  });

  useEffect(() => {
    const activation = { isActive: true, balance: 10000000 };
    verifyEmail(userId, activation, token);
    if (isFetched && user.is_active === true) {
      return navigate("/");
    }
  }, [token, userId, navigate, user, isFetched]);
  return (
    <div>
      <h1>Verify Email</h1>
    </div>
  );
};

export default VerifyEmail;
