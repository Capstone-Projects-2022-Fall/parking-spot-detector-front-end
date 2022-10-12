import { RootState } from "../store";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { LoginStatus, UserState, initialState } from "./index";
import * as Crypto from "expo-crypto";

// TODO user user object and check password here? Also check all responses and trow proper alerts/logs.
/**
 * Thunk for fetching user using axios
 * @param email The email of the user
 * @return {UserState} The retrieved user state
 */
export const fetchUserThunk = createAsyncThunk(
  "user/fetchUser",
  async (cred: string[]) => {
    let hashedUserPass = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      cred[1]
    );
    try {
      const response = await axios.get<UserState[]>(
        "https://jsonplaceholder.typicode.com/users/?email=" + cred[0],
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
      let data = response.data[0];

      let hashedDataPass = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        data.username
      );

      if (response.data.length < 1) {
        alert("Invalid username");
        throw console.log("Invalid Username");
      } else if (hashedUserPass != hashedDataPass) {
        alert("Invalid password");
        throw console.log("Invalid password");
      }
      console.log("Register user response " + JSON.stringify(data));
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("error message: ", error.message);
        throw console.warn("Invalid Username");
      }
      throw error;
    }
  }
);

/**
 * Thunk function for posting new user/registration using axios and hashing the password
 * @param user The user object to be posted as a registered user
 */
export const registerUserThunk = createAsyncThunk(
  // action type string
  "user/register",
  // callback function
  async (user: UserState) => {
    user.username = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      user.username
    );
    try {
      // configure header's Content-Type as JSON
      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };
      // make request to backend
      const { data } = await axios.post<UserState>(
        "https://3d7f29ff-a181-4b53-9204-f5b87bc7ef86.mock.pstmn.io/register",
        JSON.stringify({ user }),
        config
      );

      // Should contain success response JSON.stringify(data) === '"success..."';
      console.log("Register user response " + JSON.stringify(data));

      return data;
    } catch (error) {
      // return custom error message from API if any
      if (axios.isAxiosError(error)) {
        console.warn("error message: ", error.message);
        return error.message;
      }
      console.warn("Unexpected error registering user");
      return "Unexpected error registering user";
    }
  }
);

/**
 * Thunk function for posting new user/registration using axios
 * @param user The user object to be posted as a registered user
 */
export const updateUserProfileThunk = createAsyncThunk(
  // action type string
  "user/profile",
  // callback function
  async (user: UserState) => {
    try {
      // configure header's Content-Type as JSON
      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };
      // make request to backend
      const { data } = await axios.put<UserState>(
        "https://3d7f29ff-a181-4b53-9204-f5b87bc7ef86.mock.pstmn.io/profile/" +
          user.id,
        JSON.stringify({ user }),
        config
      );

      // Should contain success response JSON.stringify(data) === '"success ..."';
      console.log("Update user profile response " + JSON.stringify(data));
      // If not success throw alert for user already registered.

      return data;
    } catch (error) {
      // return custom error message from API if any
      if (axios.isAxiosError(error)) {
        console.warn("error message: ", error.message);
        return error.message;
      }
      console.warn("Unexpected error registering user");
      return "Unexpected error registering user";
    }
  }
);

/**
 * Thunk function for posting new user/registration using axios
 * @param user The user object to be posted as a registered user
 */
export const deleteUserThunk = createAsyncThunk(
  // action type string
  "user/delete",
  // callback function
  async (user: UserState) => {
    try {
      // configure header's Content-Type as JSON
      const config = {
        headers: {
          Accept: "application/json",
        },
      };
      // make request to backend
      const { data } = await axios.delete<UserState>(
        "https://3d7f29ff-a181-4b53-9204-f5b87bc7ef86.mock.pstmn.io/profile/" +
          user.id
      );

      // Should contain success response JSON.stringify(data) === '"success..."';
      console.log("Deleting user response " + JSON.stringify(data));

      return data;
    } catch (error) {
      // return custom error message from API if any
      if (axios.isAxiosError(error)) {
        console.warn("error message: ", error.message);
        return error.message;
      }
      console.warn("Unexpected error registering user");
      return "Unexpected error registering user";
    }
  }
);

/**
 * userSlice function for handling reducers for user actions.
 */
export const userSlice = createSlice({
  name: "user",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    currentUser: (state, action: PayloadAction<UserState>) => {
      state = action.payload;
    },
    logoutUser: (state) => {
      state.address = initialState.address;
      state.id = initialState.id;
      state.email = initialState.email;
      state.name = initialState.name;
      state.username = initialState.username;
      state.status = LoginStatus.IDLE;
      state.regStatus = LoginStatus.IDLE;
    },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserThunk.pending, (state) => {
        state.status = LoginStatus.LOADING;
      })
      .addCase(fetchUserThunk.fulfilled, (state, action) => {
        state.id = action.payload!.id;
        state.status = LoginStatus.SUCCEEDED;
        state.name = action.payload!.name;
        state.username = action.payload!.username;
        state.email = action.payload!.email;
        state.address = action.payload?.address;
      })
      .addCase(fetchUserThunk.rejected, (state) => {
        state.status = LoginStatus.FAILED;
      })
      // **************** User Registration *************************
      // Update with extra cases if needed later.
      .addCase(registerUserThunk.pending, (state) => {
        state.regStatus = LoginStatus.LOADING;
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.regStatus = LoginStatus.SUCCEEDED;
      })
      .addCase(registerUserThunk.rejected, (state) => {
        state.regStatus = LoginStatus.FAILED;
      })
      // **************** User Profile updating *************************
      // Update with extra cases if needed later.
      .addCase(updateUserProfileThunk.pending, (state) => {})
      .addCase(updateUserProfileThunk.fulfilled, (state, action) => {})
      .addCase(updateUserProfileThunk.rejected, (state) => {})
      // // **************** User delete *************************
      // // Update with extra cases if needed later.
      .addCase(deleteUserThunk.pending, (state) => {})
      .addCase(deleteUserThunk.fulfilled, (state, action) => {})
      .addCase(deleteUserThunk.rejected, (state) => {});
  },
});

export const { currentUser, logoutUser } = userSlice.actions;

// User ID global
export const selectUserId = (state: RootState) => state.user.id;

export default userSlice.reducer;
