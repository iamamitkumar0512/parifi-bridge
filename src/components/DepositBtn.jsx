import React from "react";
import { useNavigate } from "react-router-dom";

const DepositBtn = () => {
  const navigate = useNavigate();
  console.log(process.env.API_KEY);
  const handelOnclick = () => {
    navigate("/customerKyc");
  };
  return (
    <div>
      <button
        onClick={handelOnclick}
        className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900"
      >
        Deposit
      </button>
    </div>
  );
};

export default DepositBtn;
