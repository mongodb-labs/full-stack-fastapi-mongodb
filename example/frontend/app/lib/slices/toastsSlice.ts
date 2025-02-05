import {
  Dispatch,
  PayloadAction,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import { INotification } from "../interfaces";
import { generateUUID } from "../utilities";
import { RootState } from "../store";

interface ToastsState {
  notifications: INotification[];
}

const initialState: ToastsState = {
  notifications: [],
};

export const toastsSlice = createSlice({
  name: "toasts",
  initialState,
  reducers: {
    addNotice: (state: ToastsState, action: PayloadAction<INotification>) => {
      action.payload.uid = generateUUID();
      if (!action.payload.icon) action.payload.icon = "success";
      state.notifications.push(action.payload);
    },
    removeNotice: (
      state: ToastsState,
      action: PayloadAction<INotification>,
    ) => {
      state.notifications = state.notifications.filter(
        (notice) => notice.uid !== action.payload.uid,
      );
    },
    deleteNotices: () => {
      return initialState;
    },
  },
});

export const { addNotice, removeNotice, deleteNotices } = toastsSlice.actions;

export const timeoutNotice =
  (payload: INotification, timeout: number = 2000) =>
  async (dispatch: Dispatch) => {
    await new Promise((resolve) => {
      setTimeout(() => {
        dispatch(removeNotice(payload));
        resolve(true);
      }, timeout);
    });
  };

export const first = (state: RootState) =>
  state.toasts.notifications.length > 0 && state.toasts.notifications[0];
export const notices = (state: RootState) => state.toasts.notifications;

export default toastsSlice.reducer;
