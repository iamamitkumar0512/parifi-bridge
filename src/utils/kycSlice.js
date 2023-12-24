import { createSlice } from "@reduxjs/toolkit";

const signedAgreementSlice = createSlice({
  name: "kycData",
  initialState: {
    kycData: {},
  },
  reducers: {
    setKycData: (state, action) => {
      state.signedAgreementId = action.payload;
    },
  },
});

export const { setSignedAgreementId } = signedAgreementSlice.actions;
export default signedAgreementSlice.reducer;
