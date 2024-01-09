"use client";

import { store } from "./store";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";

persistStore(store); // persist the store

export default function ReduxProvider(props: React.PropsWithChildren) {
  return <Provider store={store}>{props.children}</Provider>;
}
