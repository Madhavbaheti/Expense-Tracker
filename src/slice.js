import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentEmail: null,
  opened_card: null,
};

const yourSlice = createSlice({
  name: "Setemail",
  initialState,
  reducers: {
    setCurrentEmail: (state, action) => {
      return { ...state, currentEmail: action.payload };
    },
  },
});

const currentCardSlice = createSlice({
  name: "Current_Card",
  initialState,
  reducers: {
    setCurrentCard: (state, action) => {
      return { ...state, opened_card: action.payload };
    },
  },
});

export const { setCurrentEmail } = yourSlice.actions;
export const { setCurrentCard } = currentCardSlice.actions;
export const currentCardReducer = currentCardSlice.reducer;
export const emailReducer = yourSlice.reducer;
