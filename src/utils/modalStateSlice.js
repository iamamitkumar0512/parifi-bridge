import { createSlice } from "@reduxjs/toolkit";

const modalStateSlice = createSlice({
  name: "modalState",
  initialState: {
    bankModalState: false,
  },

  reducers: {
    setCloseBtn: (state) => {
      state.bankModalState = false;
    },

    setBankModalState: (state) => {
      state.bankModalState = true;
    },
  },
});

export const { setCloseBtn, setBankModalState } = modalStateSlice.actions;

export default modalStateSlice.reducer;
