import React from "react";
import axios from "axios";
import { useFormik } from "formik";
import generateUuid from "../utils/generateUuid";
import { useState } from "react";
import styles from "../styles/Username.module.css";
import { useSelector } from "react-redux";
import store from "../utils/store";

const AddFunds = () => {
  const customerData = useSelector((store) => store.customer.customerData);
  const customerId = customerData.customer_id;
  console.log(customerId, customerData);
  const uuid = generateUuid();
  const [data, setData] = useState();
  const formik = useFormik({
    initialValues: {
      type: "wire",
      crrency: "",
      amount: "",
      deposit_currency: "",
      deposit_adress: "",
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      const body_data = {
        amount: values.amount,
        on_behalf_of: customerId,
        developer_fee: "0.5",
        source: {
          payment_rail: values.type,
          currency: values.currency || "usd",
        },
        destination: {
          payment_rail: "arbitrum",
          currency: values.deposit_currency || "usdc",
          to_address:
            values.deposit_adress ||
            "0x30f06f86F107f9523f5b91A8E8AEB602b7b260BD",
        },
      };
      console.log(values);
      try {
        const response = await axios.post(
          "/v0/transfers",
          { ...body_data },
          {
            headers: {
              accepts: "application/json",
              "Api-Key": process.env.API_KEY,
              "Idempotency-Key": uuid,
            },
          }
        );
        console.log(response.data);
        setData(response.data);
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
              placeholder="currency*"
            />
            <input
              {...formik.getFieldProps("amount")}
              className={styles.lgtextbox}
              type="text"
              placeholder="Amount*"
            />
            <input
              {...formik.getFieldProps("desosit_currency")}
              className={styles.lgtextbox}
              type="text"
              placeholder="crypto currency(usdc)*"
            />
            <input
              {...formik.getFieldProps("desosit_adress")}
              className={styles.lgtextbox}
              type="text"
              placeholder="wallet address*"
            />
            <button className={styles.btn} type="submit">
              Deposit
            </button>
          </div>
        </form>
      </div>
      {data && (
        <div>
          <h2 className="text-2xl">Recipt</h2>
          <p className="text-lg text-start">created_at:{data.created_at}</p>
          <p className="text-lg text-start">imad: {data.source.imad}</p>
          <p className="text-lg text-start">omd:{data.source.omad}</p>
          <p className="text-lg text-start">
            deposit_message:{data.source_deposit_instructions.deposit_message}
          </p>
          <p className="text-lg text-start">
            bank_beneficiary_name :
            {data.source_deposit_instructions.bank_beneficiary_name}
          </p>
        </div>
      )}
    </div>
  );
};

export default AddFunds;
