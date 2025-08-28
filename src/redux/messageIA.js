import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isValid: false,
  message: null,
};

export const messageIA = createSlice({
  name: "messageIA",
  initialState,
  reducers: {
    redux_setMessageIA: (state = initialState, action) => {
      if (action.payload === null) {
        return {
          isValid: true,
          message: null,
        };
      } else {
        return {
          isValid: true,
          message: action.payload,
        };
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { redux_setMessageIA } = messageIA.actions;

export default messageIA.reducer;
