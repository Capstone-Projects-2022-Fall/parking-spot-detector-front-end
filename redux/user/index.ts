// For redux
export interface UserState {
  id: number;
  name: string;
  username: string;
  email: string;
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

export interface User {
  userId: number;
  userName: string;
  email: string;
  password: string;
  phone: number;
}

export enum LoginStatus {
  IDLE = "idle",
  LOADING = "loading",
  SUCCEEDED = "succeeded",
  FAILED = "failed",
}
