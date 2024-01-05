import jsonwebtoken from "jsonwebtoken";

const getJWTToken = () => {
  const secret = process.env.REACT_APP_JWT_SECRET;
  return jsonwebtoken.sign({}, secret, { expiresIn: "1 day" });
};

export default getJWTToken;
