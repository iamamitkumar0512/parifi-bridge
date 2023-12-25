import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import AddBankAccount from "./AddBankAccount";
import { useDispatch, useSelector } from "react-redux";
import { setCustomerData, setCustomerState } from "../utils/cutsomerSlice";
import { setKycData } from "../utils/kycSlice";
import { setBankModalState } from "../utils/modalStateSlice";

const CustomerStatus = () => {
  const bankData = useSelector((store) => store.bankAccount.bankData);
  console.log(bankData);
  const kyc_data = useSelector((store) => store.kyc.kycData);
  const customerState = useSelector((store) => store.customer.customerState);
  console.log(customerState);
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(setKycData(JSON.parse(localStorage.getItem("kycData"))));
  }, []);
  const dispatch = useDispatch();
  const [userData, setUserData] = useState();
  const kyc = JSON.parse(localStorage.getItem("kycData"));
  const kyc_link = kyc["kyc_link"] || kyc_data["kyc_link"];
  const kyc_link_id = kyc.id || kyc_data.id;

  const handelAddFunds = () => {
    dispatch(
      setBankModalState(JSON.parse(localStorage.getItem("bankDetails")))
    );
    dispatch(setCustomerData(JSON.parse(localStorage.getItem("customer"))));
    navigate("/addFunds");
  };
  const makeApiCall = async () => {
    try {
      const response = await axios.get(
        `https://api.sandbox.bridge.xyz/v0/kyc_links/${kyc_link_id}`,
        {
          headers: {
            "Api-Key": process.env.REACT_APP_API_KEY,
          },
        }
      );
      console.log(response.data);
      setUserData(response.data);
      dispatch(setCustomerData(response.data));
      localStorage.setItem("customer", JSON.stringify(response.data));
      localStorage.setItem("kyc_status", response.data.kyc_status);
      dispatch(setCustomerState(response.data.kyc_status));
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data.message : error.message
      );
    }
  };
  const handelOnclick = async () => {
    await makeApiCall();
  };
  return (
    <div className="flex flex-col justify-center justify-items-center px-[250px] bg-slate-400 p-20">
      <h1>Customer Status</h1>
      <div className="bg-white border-2 border-gray-300 my-20 p-6 w-[80%] justify-center">
        <div className="flex justify-between p-3 m-3">
          <div className="flex flex-col">
            <h2 className="text-xl text-start">
              You will need to verify Your Identity with Persona
            </h2>
            <p className="text-sm text-start my-2">
              *If You have completed the process with Persona.Then you recive a
              mail.
            </p>
            <p className="text-sm text-start">
              To know your status you cn click on check status button
            </p>
          </div>
          <Link to={kyc_link}>
            <button className="border bg-green-800 w-40 py-1 rounded-lg text-gray-50 text-sm shadow-sm text-center disabled:bg-slate-600">
              Launch Persona Again
            </button>
          </Link>
        </div>
        <div className="flex justify-between p-3 m-3">
          <h2 className="text-2xl text-start">To check your status</h2>
          <button
            onClick={handelOnclick}
            className="border bg-green-800 w-40 py-1 rounded-lg text-gray-50 text-sm shadow-sm text-center disabled:bg-slate-600"
          >
            Check Status
          </button>
        </div>
        {userData && (
          <div className="m-4 p-6 text-start">
            <h2 className="p-6 text-xl">UserData</h2>
            <p className="text-sm"> Created At: {userData.created_at}</p>
            <p className="text-sm"> Email: {userData.email}</p>
            <p className="text-sm">Status: {userData.kyc_status}</p>
            <p className="text-sm">fullName: {userData.full_name}</p>
            <p className="text-sm">Id: {userData.customer_id}</p>
          </div>
        )}
        {customerState === "approved" && (
          <button
            onClick={() => dispatch(setBankModalState())}
            className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900"
          >
            Add BankAccount
          </button>
        )}
        <AddBankAccount />
        {bankData && (
          <div className="m-4 p-6 text-start">
            <h2 className="p-6 text-xl">BankData</h2>
            <p className="text-sm"> Created At: {bankData.created_at}</p>
            <p className="text-sm"> Bank Name: {bankData.bak_name}</p>
            <p className="text-sm">Account Name: {bankData.account_name}</p>
            <p className="text-sm">Owner Name: {bankData.account_owner_name}</p>
            <p className="text-sm">Id: {bankData.id}</p>
            <button
              onClick={handelAddFunds}
              className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900"
            >
              Add Funds
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerStatus;
