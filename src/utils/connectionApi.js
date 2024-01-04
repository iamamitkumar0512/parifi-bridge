import axios from "axios";

const baseUrl = "http://localhost:3001";

const jwt =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDQyNzA5MTgsImV4cCI6MTcwNDM1NzMxOH0.7Zn7dv1dUWNgpVR458q3wXg1yn5mhcGGYQBnGHVSbA0";

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
