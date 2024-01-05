import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useRef } from "react";
import { requestAPI } from "../utils/connectionApi";
import { walletAddress } from "../utils/constant";
import axios from "axios";

const KycTosLink = () => {
  const [data, setData] = useState();
  const { state } = useLocation();
  const [disabled, setDisabled] = useState(true);
  const [modal, setModal] = useState(false);
  const iframeRef = useRef(null);

  const apiCall = async () => {
    try {
      const response = await requestAPI(
        "GET",
        `/bridge-user/${walletAddress}`,
        {}
      );
      setData(response.data);
      try {
        const response1 = await axios.get(
          `/api/v0/kyc_links/${response.data.bridgeKycLinkId}`,
          {
            headers: {
              "Api-Key": process.env.REACT_APP_API_KEY,
            },
          }
        );
        setData(response1.data);
      } catch (error) {
        console.error(
          "Error:",
          error.response ? error.response.data.message : error.message
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (state) {
      setData(state.data);
    } else {
      apiCall();
    }
  }, []);
  const tos_link = data?.tos_link;
  const kyc_link =
    data?.kyc_link + `&redirect-uri=${process.env.REACT_APP_REDIRECT_URI}`;
  const handleMessage = async (event) => {
    if (event.origin === "https://dashboard.bridge.xyz") {
      localStorage.setItem("signedAgreementId", event.data.signedAgreementId);
      setModal(false);
      setDisabled(false);
      const response = await requestAPI(
        "PATCH",
        `/bridge-user/${walletAddress}`,
        {
          status: "tos_status_accepted",
        }
      );
      console.log("kyc_accepted", response);
    }
  };
  return (
    <>
      <div className="flex flex-col justify-center justify-items-center px-[250px] bg-slate-400 p-20">
        <h1>Start by createing an account</h1>
        <div className="bg-white border-2 border-gray-300 my-20 p-6 w-[80%] justify-center">
          <div className="flex justify-between p-3 m-3">
            <div className="flex flex-col">
              <h2 className="text-2xl">Please accept terms&conditions</h2>
              <p className="text-sm text-start">
                Please accept terms and conditions first to launch Persona
              </p>
            </div>
            <button
              onClick={() => setModal(true)}
              className="border bg-green-800 w-40 py-1 rounded-lg text-gray-50 text-sm shadow-sm text-center"
            >
              Click here
            </button>
          </div>
          <div className="flex justify-between p-3 m-3">
            <div className="flex flex-col">
              <h2 className="text-2xl">
                You will need to verify Your Identity with Persona
              </h2>
              <p className="text-sm text-start">
                You will be asked to provide your ID and few others details
                about yourself
              </p>
            </div>
            <Link to={kyc_link}>
              <button
                disabled={disabled}
                className="border bg-green-800 w-40 py-1 rounded-lg text-gray-50 text-sm shadow-sm text-center disabled:bg-slate-600"
              >
                Launch Persona
              </button>
            </Link>
          </div>
        </div>
      </div>
      {modal && (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="container  mx-auto">
              <div className="flex flex-col justify-center items-center h-screen">
                <div
                  className="bg-slate-500"
                  style={{ width: "80%", paddingTop: "1em" }}
                >
                  <div className="title flex flex-row justify-between items-center">
                    <h4 className="text-2xl font-bold item-center">
                      TOS Screen
                    </h4>
                    <button
                      className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-sm px-2 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => setModal(false)}
                    >
                      Close
                    </button>
                  </div>

                  <div className="p-6">
                    <iframe
                      ref={iframeRef}
                      title="Embedded URL"
                      src={tos_link}
                      width="600"
                      height="400"
                      allowFullScreen
                      onLoad={() => console.log("Iframe loaded")}
                    />
                    {window.addEventListener("message", handleMessage)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default KycTosLink;
