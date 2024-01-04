import React, { useEffect } from "react";
import generateUuid from "../utils/generateUuid";
import axios from "axios";
import { useFormik } from "formik";
import { useState } from "react";
import styles from "../styles/Username.module.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setKycData } from "../utils/kycSlice";
import { toast, Toaster } from "react-hot-toast";
import { requestAPI } from "../utils/connectionApi";
import { walletAddress } from "../utils/constant";

const Bridge = () => {
  const [data, setData] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const uuid = generateUuid();
  const formik = useFormik({
    initialValues: {
      type: "",
      email: "",
      full_name: "",
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          "/api/v0/kyc_links",
          { ...values },
          {
            headers: {
              "Api-Key": process.env.REACT_APP_API_KEY,
              "Idempotency-Key": uuid,
            },
          }
        );
        console.log(response.data);
        setData(response.data);
        try {
          const data = {
            walletAddress: walletAddress,
            status: "kyc_link_genarated",
            bridgeKycLinkId: response.data.id,
          };
          const response1 = await requestAPI("POST", "/bridge-user", data);
          console.log(response1.data);
        } catch (error) {
          console.log(error);
          toast.error(error.response.data.message);
        }
        localStorage.setItem("kycData", JSON.stringify(response.data));
        dispatch(setKycData(response.data));
        navigate("/kycTos", { state: { data: response.data } });
      } catch (error) {
        console.error(
          "Error:",
          error.response ? error.response.data.message : error.message
        );
        toast.error(
          error.response ? error.response.data.message : error.message
        );
      }
    },
  });

  return (
    <div className="flex flex-col justify-center justify-items-center px-[250px] bg-slate-400 p-20">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <h1>Start by createing an account</h1>
      <div className="bg-white border-2 border-gray-300 my-20 p-6 w-[80%] justify-center">
        <form className="py-1" onSubmit={formik.handleSubmit}>
          <div className="textbox flex flex-col items-center gap-5">
            <select
              {...formik.getFieldProps("type")}
              className={styles.lgtextbox}
            >
              <option defaultValue={"individual"}>
                What type of account do you want to create
              </option>
              <option value="individual">Personal account</option>
              <option value="business">Business</option>
            </select>
            <input
              {...formik.getFieldProps("email")}
              className={styles.lgtextbox}
              type="text"
              placeholder="Email*"
            />
            <input
              {...formik.getFieldProps("full_name")}
              className={styles.lgtextbox}
              type="text"
              placeholder="Full Name*"
            />
            <button className={styles.btn} type="submit">
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Bridge;
