import { configureStore } from "@reduxjs/toolkit";
import kycSlice from "./kycSlice";
import modalStateSlice from "./modalStateSlice";
import cutsomerSlice from "./cutsomerSlice";
import bankSlice from "./bankSlice";

const store = configureStore({
  reducer: {
    kyc: kycSlice,
    modalState: modalStateSlice,
    customer: cutsomerSlice,
    bankAccount: bankSlice,
  },
});

export default store;
