import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AddBankAccount from "./AddBankAccount";
import { useDispatch } from "react-redux";
import { setBankModalState } from "../utils/modalStateSlice";
import { requestAPI } from "../utils/connectionApi";
import { walletAddress } from "../utils/constant";
import BankAccountDetails from "./BankAccountDetails";

const CustomerStatus = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userData, setUserData] = useState();
  const [kycData, setKycData] = useState();
  const [kycStatus, setKycStatus] = useState(false);

  const apiCall = async () => {
    try {
      const response = await requestAPI(
        "GET",
        `/bridge-user/${walletAddress}`,
        {}
      );
      if (response.data.bridgeKycStatus === "approved") {
        setKycStatus(true);
        setUserData(response.data);
        console.log(response.data);
        return;
      }
      setUserData(response.data);
      try {
        const response1 = await axios.get(
          `/v0/kyc_links/${response.data.bridgeKycLinkId}`,
          {
            headers: {
              "Api-Key": process.env.REACT_APP_API_KEY,
            },
          }
        );
        setKycData(response1.data);
        if (response1.data.kyc_status === "approved") {
          const data = {
            bridgeCustomerId: response1.data.customer_id,
            bridgeKycStatus: response1.data.kyc_status,
            status: "kyc_status_approved",
          };
          try {
            const response2 = await requestAPI(
              "PATCH",
              `/bridge-user/${walletAddress}`,
              data
            );
            console.log(response2.data);
            setKycStatus(true);
          } catch (error) {
            console.log(error);
          }
        }
      } catch (error) {
        console.error(error);
      }
    } catch (error) {
      console.error(error);
      navigate("/");
    }
  };

  useEffect(() => {
    apiCall();
    console.log(userData);
  }, []);

  const handelAddFunds = () => {
    navigate("/addFunds");
  };
  const makeApiCall = async () => {
    try {
      const response = await axios.get(
        `/v0/kyc_links/${userData.bridgeKycLinkId}`,
        {
          headers: {
            "Api-Key": process.env.REACT_APP_API_KEY,
          },
        }
      );
      if (response.data.kyc_status === "approved") {
        const data = {
          bridgeCustomerId: response.data.customer_id,
          bridgeKycStatus: response.data.kyc_status,
          status: "kyc_status_approved",
        };
        try {
          const response1 = await requestAPI(
            "PATCH",
            `/bridge-user/${walletAddress}`,
            data
          );
          console.log(response1.data);
          setKycStatus(true);
        } catch (error) {
          console.log(error);
        }
      }
      setKycData(response.data);
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
          <Link
            to={
              kycData?.kyc_link +
              `&redirect-uri=${process.env.REACT_APP_REDIRECT_URI}`
            }
          >
            <button
              disabled={kycStatus}
              className="border bg-green-800 w-40 py-1 rounded-lg text-gray-50 text-sm shadow-sm text-center disabled:bg-slate-600"
            >
              Launch Persona Again
            </button>
          </Link>
        </div>
        <div className="flex justify-between p-3 m-3">
          <h2 className="text-2xl text-start">To check your status</h2>
          <button
            onClick={handelOnclick}
            disabled={kycStatus}
            className="border bg-green-800 w-40 py-1 rounded-lg text-gray-50 text-sm shadow-sm text-center disabled:bg-slate-600"
          >
            Check Status
          </button>
        </div>
        {kycData && (
          <div className="m-4 p-6 text-start">
            <h2 className="p-6 text-xl">UserData</h2>
            <p className="text-sm"> Created At: {kycData.created_at}</p>
            <p className="text-sm"> Email: {kycData.email}</p>
            <p className="text-sm">Status: {kycData.kyc_status}</p>
            <p className="text-sm">fullName: {kycData.full_name}</p>
            <p className="text-sm">Id: {kycData.customer_id}</p>
          </div>
        )}
        <BankAccountDetails />
        {kycStatus && (
          <button
            onClick={() => dispatch(setBankModalState())}
            disabled={
              userData.bridgeExternalBankAccountId.length >= 3 ? true : false
            }
            className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900 disabled:bg-slate-600"
          >
            Add BankAccount
          </button>
        )}
        <AddBankAccount />
        {userData?.bridgeExternalBankAccountId.length && (
          <button
            onClick={handelAddFunds}
            className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900"
          >
            Add Funds
          </button>
        )}
      </div>
    </div>
  );
};

export default CustomerStatus;
