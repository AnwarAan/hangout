import axios from "axios";

const url = "http://localhost:8000/api";

export const getAPI = async (params) => {
  const res = await axios.get(`${url}/${params}`);
  return res.data;
};

export const postAPI = async (params, data) => {
  const res = await axios.post(`${url}/${params}`, data);
  return res.data;
};
