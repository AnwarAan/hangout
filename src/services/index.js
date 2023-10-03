import axios from "axios";
const url = `http://localhost:8000/api`;

// const client = axios.create({
//   baseURL: "http://localhost:8000",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

const verifyEmail = async (userId, body, token) => {
  await axios.put(`${url}/user/${userId}`, body, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log(userId);
};

export default verifyEmail;
