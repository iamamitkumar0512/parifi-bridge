import React, { useEffect, useState } from "react";
import { requestAPI } from "../utils/connectionApi";
import { walletAddress } from "../utils/constant";
import axios from "axios";

const Transcation = () => {
  const [userdata, setUserData] = useState();
  const [transcation, setTranscation] = useState();
  const [transcationId, setTranscationId] = useState([]);

  const apiCall = async () => {
    try {
      const response = await requestAPI("GET", `/user/${walletAddress}`);
      console.log(response.data);
      setUserData(response.data);
      setTranscation(response.data.transaction);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    apiCall();
  }, []);

  useEffect(() => {
    if (transcation) {
      console.log(transcation);
      const trans = transcation
        .filter((item) => item.transactionStatus !== "payment_processed")
        .map((item) => item.transactionId);
      setTranscationId(trans);
    }
  }, [transcation]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      transcationId.length && checkTransactionStatus();
    }, 1000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [transcationId]);

  const checkTransactionStatus = async () => {
    const updatedTransactions = await Promise.all(
      transcationId.map(async (transactionId) => {
        // Make an API call to check the status of each transaction
        const response = await axios.get(`/v0/transfers/${transactionId}`, {
          headers: {
            "Api-Key": process.env.REACT_APP_API_KEY,
          },
        });

        if (response.data.state === "payment_processed") {
          console.log(response.data.state, transactionId);

          return null;
        }

        // Transaction is still pending, keep it in the array
        return transactionId;
      })
    );

    // Remove null values (completed transactions) from the array
    const filteredTransactions = updatedTransactions.filter(Boolean);
    console.log(filteredTransactions);
    const trans = transcation.map((trans) =>
      filteredTransactions.indexOf(trans) === -1
        ? { ...trans, transactionStatus: "payment_processed" }
        : trans
    );
    console.log(trans);
    try {
      const response1 = await requestAPI("PATCH", `/user/${walletAddress}`, {
        transaction: trans,
      });
      console.log(response1.data);
    } catch (err) {
      console.log(err);
    }
    setTranscation(trans);

    // Update the state with the filtered transactions
    setTranscationId(filteredTransactions);
  };

  return (
    <div>
      Transcation
      {userdata && (
        <>
          <ul>
            {transcation.map((item) => (
              <li className="text-sm" key={item.transactionId}>
                {item.transactionDate} - {item.transactionAmount}-{" "}
                {item.transactionType} - {item.transactionStatus}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Transcation;
