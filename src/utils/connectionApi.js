import axios from "axios";

const baseUrl = "http://localhost:3001";

const jwt =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDQxODQwNjIsImV4cCI6MTcwNDI3MDQ2Mn0.WunY6UV7E1FMu10m4j9sABc3XXF3HpYP41qh5iYJM2s";

export const requestAPI = async (method, url, data, params) => {
  const promise = await axios({
    method: method,
    url: `${baseUrl}${url}`,
    params: params,
    data: data,
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/json",
    },
  });

  return promise;
};
