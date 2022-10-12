import { RootState } from "../store";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { LoginStatus, UserState, User } from "./index";

/**
 * The initial state of the user to be stored in redux
 */
const initialState: UserState = {
  id: 0,
  name: "",
  username: "",
  email: "",
  status: LoginStatus.IDLE,
  address: {
    street: "",
    suite: "",
    city: "",
    zipcode: "",
    geo: {
      lat: 0,
      lng: 0,
    },
  },
};

// TODO user user object and check password here? Also check all responses and trow proper alerts/logs.
/**
 * Thunk for fetching user using axios
 * @param email The email of the user
 * @return {UserState} The retrieved user state
 */
export const fetchUserAsync = createAsyncThunk(
  "user/fetchUser",
  async (email: string) => {
    try {
      const response = await axios.get<UserState[]>(
        "https://jsonplaceholder.typicode.com/users/?email=" + email,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
      let data = response.data[0];
      if (response.data.length < 1) {
        alert("Invalid username");
        throw console.log("Invalid Username");
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
 * Thunk function for posting new user/registration using axios
 * @param user The user object to be posted as a registered user
 */
export const registerUser = createAsyncThunk(
  // action type string
  "user/register",
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
      const { data } = await axios.post<User>(
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
export const updateUserProfile = createAsyncThunk(
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
        "https://3d7f29ff-a181-4b53-9204-f5b87bc7ef86.mock.pstmn.io/profile/" +
          user.userId,
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
export const deleteUser = createAsyncThunk(
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
        "https://3d7f29ff-a181-4b53-9204-f5b87bc7ef86.mock.pstmn.io/profile/" +
          user.userId
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
    },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserAsync.pending, (state) => {
        state.status = LoginStatus.LOADING;
      })
      .addCase(fetchUserAsync.fulfilled, (state, action) => {
        state.id = action.payload!.id;
        state.status = LoginStatus.SUCCEEDED;
        state.name = action.payload!.name;
        state.username = action.payload!.username;
        state.email = action.payload!.email;
        state.address = action.payload?.address;
      })
      .addCase(fetchUserAsync.rejected, (state) => {
        state.status = LoginStatus.FAILED;
      })
      // **************** User Registration *************************
      // Update with extra cases if needed later.
      .addCase(registerUser.pending, (state) => {})
      .addCase(registerUser.fulfilled, (state, action) => {})
      .addCase(registerUser.rejected, (state) => {})
      // **************** User Profile updating *************************
      // Update with extra cases if needed later.
      .addCase(updateUserProfile.pending, (state) => {})
      .addCase(updateUserProfile.fulfilled, (state, action) => {})
      .addCase(updateUserProfile.rejected, (state) => {})
      // // **************** User delete *************************
      // // Update with extra cases if needed later.
      .addCase(deleteUser.pending, (state) => {})
      .addCase(deleteUser.fulfilled, (state, action) => {})
      .addCase(deleteUser.rejected, (state) => {});
  },
});

export const { currentUser, logoutUser } = userSlice.actions;

// User ID global
export const selectUserId = (state: RootState) => state.user.id;

export default userSlice.reducer;
