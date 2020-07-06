import { combineReducers } from "redux";
import errorReducer from "./reducers/errorReducer";
import authReducer from "./reducers/authReducer";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
  blacklist: ["ui"],
};

const rootReducer = combineReducers({
  error: errorReducer,
  auth: authReducer,
});

export default persistReducer(persistConfig, rootReducer);
