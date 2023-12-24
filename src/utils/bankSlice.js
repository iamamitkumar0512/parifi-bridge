import { createSlice } from "@reduxjs/toolkit";

const bankAccountSlice = createSlice({
  name: "bankAccount",
  initialState: {
    bankData: {},
  },
  reducers: {
    setBankData: (state, action) => {
      state.bankData = action.payload;
    },
  },
});

export const { setBankData } = bankAccountSlice.actions;
export default bankAccountSlice.reducer;
