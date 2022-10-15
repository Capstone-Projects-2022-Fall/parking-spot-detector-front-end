import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
/**
 *
 * @returns {AppDispatch} the useDispatch function for the redux store.
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();
/**
 * @returns {RootState} the useSelector function for the redux store.
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
