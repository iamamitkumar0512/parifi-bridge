import axios from "axios";
import { useState } from "react";
import useInterval from "./useInterval";

export function usePolling(transcationId, pollingInterval) {
  const [delay, setDelay] = useState(pollingInterval);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const [clearInterval] = useInterval(async () => {
    try {
      const response = await axios.get(`/api/v0/transfers/${transcationId}`, {
        headers: {
          "Api-Key": process.env.REACT_APP_API_KEY,
        },
      });
      console.log(response.data);
      if (response.data.state === "payment_processed") {
        setResult(response.data);
        console.log(response.data);
        setDelay(null);
      }
    } catch (error) {
      setError({ error: "Error occured" });
      console.error(error);
    }
  }, delay);

  return [result, error, clearInterval];
}
