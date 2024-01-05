import React, { useEffect, useState } from "react";
import { requestAPI } from "../utils/connectionApi";
import { walletAddress } from "../utils/constant";
import axios from "axios";

const BankAccountDetails = () => {
  const [data, setData] = useState();
  const apiCall = async () => {
    try {
      const response = await requestAPI("GET", `/bridge-user/${walletAddress}`);
      //   console.log(response.data);
      try {
        const response1 = await axios.get(
          `/api/v0/customers/${response.data.bridgeCustomerId}/external_accounts`,
          {
            headers: {
              "Api-Key": process.env.REACT_APP_API_KEY,
            },
          }
        );
        // console.log(response1.data);
        setData(response1.data);
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    apiCall();
  }, []);

  return data?.count ? (
    <div>
      <h2 className="text-sm">You have added {data?.count} bank Account</h2>
      <ul>
        {data?.data.map((item) => (
          <li className="text-sm" key={item.id}>
            {item.bank_name} - {item.last_4}
          </li>
        ))}
      </ul>
    </div>
  ) : (
    <h2>You have not added any bank Account</h2>
  );
};

export default BankAccountDetails;
