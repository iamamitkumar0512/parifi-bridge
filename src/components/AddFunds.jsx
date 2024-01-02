import React, { useEffect } from "react";
import axios from "axios";
import { useFormik } from "formik";
import generateUuid from "../utils/generateUuid";
import { useState } from "react";
import styles from "../styles/Username.module.css";
import { requestAPI } from "../utils/connectionApi";
import { walletAddress } from "../utils/constant";
import BankAccountDetails from "./BankAccountDetails";

const AddFunds = () => {
  const [userdata, setUserData] = useState();
  const apiCall = async () => {
    const response = await requestAPI("GET", `/bridge-user/${walletAddress}`);
    console.log(response.data);
    setUserData(response.data);
  };

  useEffect(() => {
    apiCall();
  }, []);
  // console.log(customerId, customerData);
  const uuid = generateUuid();
  const [data, setData] = useState();
  const formik = useFormik({
    initialValues: {
      type: "wire",
      currency: "usd",
      amount: "",
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      const body_data = {
        amount: values.amount,
        on_behalf_of: userdata.bridgeCustomerId,
        developer_fee: "0.5",
        source: {
          payment_rail: values.type,
          currency: values.currency || "usd",
        },
        destination: {
          payment_rail: "arbitrum",
          currency: "usdc",
          to_address: `${walletAddress}`,
        },
      };
      // console.log(values);
      try {
        const response = await axios.post(
          "/v0/transfers",
          { ...body_data },
          {
            headers: {
              accepts: "application/json",
              "Api-Key": process.env.REACT_APP_API_KEY,
              "Idempotency-Key": uuid,
            },
          }
        );
        // console.log(response.data);
        setData(response.data);
        try {
          const data = {
            bridgeTransactionId: response.data.id,
            bridgeTransactionType: "ONRAMP",
            bridgeTransactionStatus: response.data.state,
            bridgeTransactionAmount: response.data.amount,
            bridgeTransactionDate: response.data.created_at,
          };
          const body_data = {
            bridgeTransaction: [...userdata.bridgeTransaction, data],
          };
          const response1 = await requestAPI(
            "PATCH",
            `/bridge-user/${walletAddress}`,
            body_data
          );
          console.log(response1.data);
          setUserData(response1.data);
        } catch (err) {
          console.log(err);
        }
      } catch (error) {
        console.error(
          "Error:",
          error.response ? error.response.data.message : error.message
        );
      }
    },
  });
  return (
    <div className="flex flex-col justify-center justify-items-center px-[250px] bg-slate-400 p-20">
      <h1>Deposit Funds</h1>
      <div className="bg-white border-2 border-gray-300 my-20 p-6 w-[80%] justify-center">
        <form className="py-1" onSubmit={formik.handleSubmit}>
          <div className="textbox flex flex-col items-center gap-5">
            <select
              {...formik.getFieldProps("type")}
              className={styles.lgtextbox}
            >
              <option defaultValue={"individual"}>Deposit Methoda</option>
              <option value="wire">Wire</option>
              <option value="ach_push">ACH PUSH</option>
            </select>
            <input
              {...formik.getFieldProps("currency")}
              className={styles.lgtextbox}
              type="text"
              placeholder="usd"
            />
            <input
              {...formik.getFieldProps("amount")}
              className={styles.lgtextbox}
              type="text"
              placeholder="Amount*"
            />

            <button className={styles.btn} type="submit">
              Deposit
            </button>
          </div>
        </form>
      </div>
      {data && (
        <div>
          <p className="text-red-500 text-lg">
            *Please trnasfer from one of these account only
          </p>
          <BankAccountDetails />
          <h2 className="text-2xl">Kindly transfer funds to this account</h2>
          <p className="text-lg text-start">
            Payment Rail:{data.source_deposit_instructions.payment_rail}
          </p>
          <p className="text-lg text-start">
            Amount : {data.source_deposit_instructions.amount}
          </p>
          <p className="text-lg text-start">
            currency : {data.source_deposit_instructions.currency}
          </p>
          <p className="text-lg text-start">
            Deposit message : {data.source_deposit_instructions.deposit_message}
          </p>
          <p className="text-lg text-start">
            *Please enter this deposit message in your wire transfer
          </p>
          <p className="text-lg text-start">
            Bank Name : {data.source_deposit_instructions.bank_name}
          </p>
          <p className="text-lg text-start">
            Bank Address : {data.source_deposit_instructions.bank_address}
          </p>
          <p className="text-lg text-start">
            Bank Routing Number :{" "}
            {data.source_deposit_instructions.bank_routing_number}
          </p>
          <p className="text-lg text-start">
            Bank Account Number :{" "}
            {data.source_deposit_instructions.bank_account_number}
          </p>
          <p className="text-lg text-start">
            Bank Beneficiary Name :{" "}
            {data.source_deposit_instructions.bank_beneficiary_name}
          </p>
        </div>
      )}
    </div>
  );
};

export default AddFunds;
