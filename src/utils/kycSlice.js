import { createSlice } from "@reduxjs/toolkit";

const kycSlice = createSlice({
  name: "kyc",
  initialState: {
    kycState: "",
  },
  reducers: {
    setKycData: (state, action) => {
      state.kycState = action.payload;
    },
  },
});

export const { setKycData } = kycSlice.actions;
export default kycSlice.reducer;
