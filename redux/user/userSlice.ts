import { RootState } from "../store";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { LoginStatus, initialState, User } from "./index";
import * as Crypto from "expo-crypto";

/**
 * Thunk for fetching user using axios
 * @param email The email of the user
 * @return {User} The retrieved user state
 */
export const fetchUserThunk = createAsyncThunk(
  "user/fetchUser",
  async (cred: string[]) => {
    let hashedUserPass = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      cred[1]
    );
    try {
      const response = await axios.get<User>(
        "https://a8553b5c-8fa1-4270-9c5e-ed3c2d731eae.mock.pstmn.io/users?email=" +
          cred[0],
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
      let data = response.data;
      if ((response.status = 200)) {
        if (hashedUserPass != data.password_hash) {
          console.log(response.status);
          alert("Invalid password or email");
          throw console.log("Invalid password or email");
        } else {
          console.log(response.status);
          return data;
        }
      }

      console.log("User login response " + JSON.stringify(data));
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("error message: ", error.message);
        throw console.warn("Network error");
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
  async (user: User) => {
    user.password_hash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      user.password_hash
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
      const { data } = await axios.post<User>(
        "https://a8553b5c-8fa1-4270-9c5e-ed3c2d731eae.mock.pstmn.io/users",
        user,
        config
      );

      // Should contain success response JSON.stringify(data) === '"success..."';
      console.log("Register user response " + JSON.stringify(data));
      if (JSON.stringify(data) == '{"status":"ok"}') {
        return data;
      } else {
        throw alert("Error registerning user");
      }
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
  async (user: User) => {
    try {
      // configure header's Content-Type as JSON
      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };
      // make request to backend
      const { data } = await axios.put<User>(
        "https://a8553b5c-8fa1-4270-9c5e-ed3c2d731eae.mock.pstmn.io/users" +
          user.id,
        user,
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
  async (user: User) => {
    try {
      // configure header's Content-Type as JSON
      const config = {
        headers: {
          Accept: "application/json",
        },
      };
      // make request to backend
      const { data } = await axios.delete<User>(
        "https://a8553b5c-8fa1-4270-9c5e-ed3c2d731eae.mock.pstmn.io/users" +
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
    currentUser: (state, action: PayloadAction<User>) => {
      state = action.payload;
    },
    logoutUser: (state) => {
      state.id = initialState.id;
      state.first_name = initialState.first_name;
      state.last_name = initialState.last_name;
      state.email = initialState.email;
      state.phone_number = initialState.phone_number;
      state.password_hash = initialState.password_hash;
      state.handicap = initialState.handicap;
      state.address = initialState.address;
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
        state.first_name = action.payload.first_name;
        state.last_name = action.payload.last_name;
        state.handicap = action.payload.handicap;
        state.email = action.payload.email;
        state.phone_number = action.payload.phone_number;
        state.password_hash = action.payload.password_hash;
        state.address = action.payload.address;
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
