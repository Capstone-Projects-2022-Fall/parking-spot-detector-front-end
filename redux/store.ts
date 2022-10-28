import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import parkingReducer from "./parking/parking";
import userReducer from "./user/userSlice";

/**
 * @param reducer The reducers from the slice functions.
 * @return {store} The redux store.
 */
export const store = configureStore({
  reducer: {
    user: userReducer,
    parking: parkingReducer,
  },
});

export default store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
