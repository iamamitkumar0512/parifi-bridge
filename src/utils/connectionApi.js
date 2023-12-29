import axios from "axios";

const baseUrl = "http://localhost:3001";

const jwt =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDM4MzczMzAsImV4cCI6MTcwMzkyMzczMH0.iuKvyA1vEjXUj7BhuUXHX81UmoIFwaZXrrsYKlop4ZQ";

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
