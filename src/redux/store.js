import { configureStore } from "@reduxjs/toolkit";
import messageIA from "./messageIA";

export const store = configureStore({
  reducer: {
    messageIA,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  // devTools: true
});
