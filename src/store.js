import { configureStore } from "@reduxjs/toolkit";
import { currentCardReducer, emailReducer } from "./slice";
import { persistReducer } from "redux-persist";
import { combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";


const persistConfig={
  key:"root",
  version:1,
  storage
}

const reducer = combineReducers({
  Setemail: emailReducer,
  Current_Card: currentCardReducer,
}
)
const persistedReducer = persistReducer(persistConfig,reducer)

export const store = configureStore({
  reducer: persistedReducer   
});
