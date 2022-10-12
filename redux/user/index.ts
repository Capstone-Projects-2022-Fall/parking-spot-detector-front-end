// For redux
export interface UserState {
  id: number;
  name: string;
  username: string;
  email: string;
  regStatus:
    | LoginStatus.IDLE
    | LoginStatus.LOADING
    | LoginStatus.SUCCEEDED
    | LoginStatus.FAILED;
  status:
    | LoginStatus.IDLE
    | LoginStatus.LOADING
    | LoginStatus.SUCCEEDED
    | LoginStatus.FAILED;
  address?: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: number;
      lng: number;
    };
  };
}

export enum LoginStatus {
  IDLE = "idle",
  LOADING = "loading",
  SUCCEEDED = "succeeded",
  FAILED = "failed",
}

/**
 * The initial state of the user to be stored in redux
 */
export const initialState: UserState = {
  id: 0,
  name: "",
  username: "",
  email: "",
  status: LoginStatus.IDLE,
  regStatus: LoginStatus.IDLE,
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
