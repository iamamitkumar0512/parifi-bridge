import { createSlice } from "@reduxjs/toolkit";

const kycSlice = createSlice({
  name: "kyc",
  initialState: {
    kycData: {},
  },
  reducers: {
    setKycData: (state, action) => {
      state.kycData = action.payload;
    },
  },
});

export const { setKycData } = kycSlice.actions;
export default kycSlice.reducer;
