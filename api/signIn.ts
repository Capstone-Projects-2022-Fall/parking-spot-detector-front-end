import axios, { AxiosResponse } from "axios";
import { UserSample } from "../interfaces";

// export const getUser = (username) => axios.get({
// // code
// })

export const getUser = () =>
  axios
    .get<UserSample[]>("https://jsonplaceholder.typicode.com/users")
    .then((response: AxiosResponse) => {
      console.log("Response ", response.data);
      return response.data;
    });
