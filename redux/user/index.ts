// For redux user slice

export enum LoginStatus {
  IDLE = "idle",
  LOADING = "loading",
  SUCCEEDED = "succeeded",
  FAILED = "failed",
}

export interface User {
  _id?: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone_number: string;
  password: string;
  handicap: boolean;
  address: string;
  push_token: string;
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
}

export const initialState: User = {
  _id: "",
  first_name: "",
  last_name: "",
  email: "",
  username: "",
  phone_number: "",
  password: "",
  handicap: false,
  address: "",
  push_token: "",
  status: LoginStatus.IDLE,
  regStatus: LoginStatus.IDLE,
};
