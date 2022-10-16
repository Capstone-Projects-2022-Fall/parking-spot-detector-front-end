// For redux user slice

export enum LoginStatus {
  IDLE = "idle",
  LOADING = "loading",
  SUCCEEDED = "succeeded",
  FAILED = "failed",
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password_hash: string;
  handicap: boolean;
  address: string;
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
  id: 0,
  first_name: "",
  last_name: "",
  email: "",
  phone_number: "",
  password_hash: "",
  handicap: false,
  address: "",
  status: LoginStatus.IDLE,
  regStatus: LoginStatus.IDLE,
};
