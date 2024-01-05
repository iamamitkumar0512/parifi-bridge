import axios from "axios";

const baseUrl = "https://dev.parifi.org";

const jwt =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDQ0NDMyNjcsImV4cCI6MTcwNDUyOTY2N30.F0JPQcgUvZrKQOj0ifMxHj2Din-2LPE0RFQRc0h6HYQ";

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
