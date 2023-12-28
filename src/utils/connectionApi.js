import axios from "axios";

const baseUrl = "http://localhost:3001";

const jwt =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDM3NTAxMDMsImV4cCI6MTcwMzgzNjUwM30.wwh9mwNFFRn4siblB6Rmd94QlK9y2WUg0S5gIC3flTs";

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
