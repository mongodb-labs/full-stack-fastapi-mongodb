import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  REHYDRATE,
  PERSIST,
  PURGE,
  REGISTER,
  persistReducer,
} from "redux-persist";
import authReducer from "./slices/authSlice";
import toastsReducer from "./slices/toastsSlice";
import tokensReducer from "./slices/tokensSlice";
import storage from "./storage";

const reducers = combineReducers({
  auth: authReducer,
  toasts: toastsReducer,
  tokens: tokensReducer,
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {auth: AuthState, toasts: ToastsState, tokens: TokensState}
export type AppDispatch = typeof store.dispatch;
