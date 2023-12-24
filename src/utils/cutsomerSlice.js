import { createSlice } from "@reduxjs/toolkit";

const customerSlice = createSlice({
  name: "customer",
  initialState: {
    customerState: "",
    customerData: {},
  },
  reducers: {
    setCustomerState: (state, action) => {
      state.customerState = action.payload;
    },
    setCustomerData: (state, action) => {
      state.customerData = action.payload;
    },
  },
});

export const { setCustomerState, setCustomerData } = customerSlice.actions;
export default customerSlice.reducer;
