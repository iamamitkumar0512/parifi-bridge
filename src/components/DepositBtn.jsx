import React, { useEffect } from "react";
import { walletAddress } from "../utils/constant";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { requestAPI } from "../utils/connectionApi";

const DepositBtn = () => {
  const [data, setData] = useState();
  const [status, setStatus] = useState();
  const navigate = useNavigate();

  const apiCall = async () => {
    try {
      const response = await requestAPI(
        "GET",
        `/bridge-user/${walletAddress}`,
        {}
      );
      if (response) {
        setData(response.data);
        setStatus(response.data?.status);
      }
      console.log(response);
    } catch (error) {
      console.log(error);
      console.log(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    apiCall();
    console.log(data);
  }, []);
  const handelOnclick = () => {
    if (status === "kyc_link_genarated") navigate("/kycTos");
    else if (status === "tos_status_accepted") navigate("/userStatus");
    else if (status === "kyc_status_approved") navigate("/addFunds");
    else if (status === "bank_details_added") navigate("/addFunds");
    else navigate("/customerKyc");
  };
  const handelOnclickWithdraw = () => {
    if (status === "kyc_link_genarated") navigate("/kycTos");
    else if (status === "tos_status_accepted") navigate("/userStatus");
    else if (status === "kyc_status_approved") navigate("/userStatus");
    else if (status === "bank_details_added") navigate("/withdrawFunds");
    else navigate("/customerKyc");
  };
  return (
    <div>
      <h1 className="text-2xl">Wallet Adress : {walletAddress}</h1>
      <button
        onClick={handelOnclick}
        className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900"
      >
        Deposit
      </button>
      <button
        onClick={handelOnclickWithdraw}
        className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900"
      >
        Withdraw
      </button>

      <Link to="/transcation">
        <button className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900">
          Transcation
        </button>
      </Link>
    </div>
  );
};

export default DepositBtn;
