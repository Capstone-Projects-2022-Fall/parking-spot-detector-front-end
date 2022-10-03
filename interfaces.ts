export interface User {
  id: number;
  name: string;
}

export interface Users {
  users: UserSample[];
}

export interface UserSample {
  id: number;
  name: string;
  userneme: string;
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
