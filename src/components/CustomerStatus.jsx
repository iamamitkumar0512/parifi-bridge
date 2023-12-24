import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import AddBankAccount from "./AddBankAccount";

const CustomerStatus = () => {
  const [userData, setUserData] = useState("abc");
  const kyc_link = "";
  const kyc_link_id = "";
  const makeApiCall = async () => {
    try {
      const response = await axios.get(`/v0/kyc_links/${kyc_link_id}`, {
        headers: {
          "Api-Key": "",
        },
      });
      console.log(response.data);
      setUserData(response.data);
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
          <button className="border bg-green-800 w-40 py-1 rounded-lg text-gray-50 text-sm shadow-sm text-center disabled:bg-slate-600">
            Check Status
          </button>
        </div>
        {userData && (
          <div className="m-4 p-6 text-start">
            <h2 className="p-6 text-xl">UserData</h2>
            <p className="text-sm"> Created At: {}</p>
            <p className="text-sm"> Email: {}</p>
            <p className="text-sm">Status: {}</p>
            <p className="text-sm">fullName: {}</p>
            <p className="text-sm">Id: {}</p>
          </div>
        )}
        {/* {customerState === "active" && ( */}
        <button
          // onClick={() => dispatch(setBankModalState())}
          className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900"
        >
          Add BankAccount
        </button>
        {/* )} */}
        {/* <AddBankAccount /> */}
      </div>
    </div>
  );
};

export default CustomerStatus;
