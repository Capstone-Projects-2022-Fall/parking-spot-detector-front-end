// For profile screen api test
export interface UserSample {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
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

// For redux
export interface UserState {
  id: number;
  name: string;
  username: string;
  email: string;
  status: "idle" | "loading" | "succeeded" | "failed";
  address: {
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
