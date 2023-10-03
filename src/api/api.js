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

export const postAPIFormData = async (params, data) => {
  const res = await axios.post(`${url}/${params}`, data, { headers: { "Content-Type": "multipart/form-data" } });
  return res.data;
};

export const putAPI = async (params, data, token) => {
  const res = await axios.put(`${url}/${params}`, data, { headers: { Authorization: `Bearer ${token}` } });
  console.log(`${url}/${params}`);
  return res.data;
};
