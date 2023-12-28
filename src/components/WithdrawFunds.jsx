import React, { useEffect } from "react";
import axios from "axios";
import { useFormik } from "formik";
import generateUuid from "../utils/generateUuid";
import { useState } from "react";
import styles from "../styles/Username.module.css";
import { requestAPI } from "../utils/connectionApi";
import { walletAddress } from "../utils/constant";

const WithdrawFunds = () => {
  const [userdata, setUserData] = useState();
  const [bank, setBank] = useState();
  const apiCall = async () => {
    const response = await requestAPI("GET", `/user/${walletAddress}`);
    setUserData(response.data);
    try {
      const response1 = await axios.get(
        `/v0/customers/${response.data.customerId}/external_accounts`,
        {
          headers: {
            "Api-Key": process.env.REACT_APP_API_KEY,
          },
        }
      );
      setBank(response1.data);
      console.log(response1.data);
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data.message : error.message
      );
    }
  };

  useEffect(() => {
    apiCall();
  }, []);
  const uuid = generateUuid();
  const [data, setData] = useState();
  const formik = useFormik({
    initialValues: {
      amount: "",
      withdraw_currency: "usd",
      bankId: "",
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      const body_data = {
        amount: values.amount,
        on_behalf_of: userdata.customerId,
        developer_fee: "0.5",
        source: {
          currency: "usdc",
          payment_rail: "arbitrum",
          from_address: `${walletAddress}`,
        },
        destination: {
          payment_rail: "ach",
          currency: values.withdraw_currency || "usd",
          external_account_id: values.bankId,
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
        console.log(response.data);
        setData(response.data);
        // try{
        //   const data = {
        //     transactionId: response.data.id,
        //     transactionType: "WITHDRAWAL",
        //     transactionStatus: response.data.state,
        //     transactionAmount: response.data.amount,
        //     transactionDate: response.data.created_at
        //   }
        //   const response1 = await requestAPI("PATCH",`/user/${walletAddress}`,{...data})
        // }
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
      <h1>Withdraw Funds</h1>
      <div className="bg-white border-2 border-gray-300 my-20 p-6 w-[80%] justify-center">
        <form className="py-1" onSubmit={formik.handleSubmit}>
          <div className="textbox flex flex-col items-center gap-5">
            <input
              {...formik.getFieldProps("amount")}
              className={styles.lgtextbox}
              type="text"
              placeholder="Amount*"
            />
            <input
              {...formik.getFieldProps("withdraw_currency")}
              className={styles.lgtextbox}
              type="text"
              placeholder="usd"
            />
            <select
              {...formik.getFieldProps("bankId")}
              className={styles.lgtextbox}
            >
              <option value="" disabled>
                Select bank Account
              </option>
              {bank?.data.map((account) => (
                <option key={account.id} value={account.id}>
                  {`${account.bank_name} - ${account.last_4}`}
                </option>
              ))}
            </select>
            <button className={styles.btn} type="submit">
              Withdraw
            </button>
          </div>
        </form>
      </div>
      {data && (
        <div>
          <h2 className="text-2xl">Kindaly Transfer Crypto to this wallet</h2>
          <p className="text-lg text-start">
            Amount : {data.source_deposit_instructions.amount}
          </p>
          <p className="text-lg text-start">
            Crytpo currency : {data.source_deposit_instructions.currency}
          </p>
          <p className="text-lg text-start">
            From address(your wallet address):{" "}
            {data.source_deposit_instructions.from_address}
          </p>
          <p className="text-lg text-start">
            To address: {data.source_deposit_instructions.to_address}
          </p>
          <p className="text-lg text-start">
            Payment rail : {data.source_deposit_instructions.payment_rail}
          </p>
        </div>
      )}
    </div>
  );
};

export default WithdrawFunds;
