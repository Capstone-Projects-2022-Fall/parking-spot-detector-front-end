import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Center,
  FormControl,
  Heading,
  Input,
  Link,
  VStack,
  Text,
} from "native-base";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { logoutUser, registerUserThunk } from "../../redux/user/userSlice";
import { initialState, LoginStatus } from "../../redux/user/index";
import { StackActions, useNavigation } from "@react-navigation/native";

export default function RegisterScreen() {
  const [userFirstName, setFirstName] = useState("");
  const [userLastName, setLastName] = useState("");

  const [userEmail, setUserEmail] = useState("");
  const [userPass1, setUserPass1] = useState("");
  const [userPass2, setUserPass2] = useState("");

  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  let data = { ...initialState };

  useEffect(() => {
    console.log("LoginStatus: " + user.status);

    if (user.regStatus == LoginStatus.SUCCEEDED) {
      // Clear input text states.
      setFirstName("");
      setLastName("");
      setUserPass1("");
      setUserPass2("");

      // Logout user to start with fresh state.
      dispatch(logoutUser());
      alert("Successful Registration. Sign in to continue");
      navigation.dispatch(StackActions.replace("SignIn"));
    }
  }, [user.regStatus]);

  return (
    <Center w="100%">
      <Box safeArea p="2" py="8" w="90%" maxW="290">
        <Heading
          size="lg"
          fontWeight="600"
          color="coolGray.800"
          _dark={{
            color: "warmGray.50",
          }}
        >
          Welcome
        </Heading>
        <Heading
          mt="1"
          _dark={{
            color: "warmGray.200",
          }}
          color="coolGray.600"
          fontWeight="medium"
          size="xs"
        >
          Sign in to continue!
        </Heading>

        <VStack space={3} mt="5">
          <FormControl>
            <FormControl.Label>First name</FormControl.Label>
            <Input onChangeText={(val) => setFirstName(val)} />
          </FormControl>
          <FormControl>
            <FormControl.Label>Last name</FormControl.Label>
            <Input onChangeText={(val) => setLastName(val)} />
          </FormControl>
          <FormControl>
            <FormControl.Label>Email</FormControl.Label>
            <Input onChangeText={(val) => setUserEmail(val)} />
          </FormControl>
          <FormControl>
            <FormControl.Label>Password</FormControl.Label>
            <Input type="password" onChangeText={(val) => setUserPass1(val)} />
            <FormControl.Label>Confirm Password</FormControl.Label>
            <Input type="password" onChangeText={(val) => setUserPass2(val)} />
            <Link
              _text={{
                fontSize: "xs",
                fontWeight: "500",
                color: "purple.800",
              }}
              alignSelf="flex-end"
              mt="1"
              onPress={() => navigation.navigate("Root")}
            >
              Forget Password?
            </Link>
          </FormControl>
          <Button
            mt="2"
            colorScheme="purple"
            onPress={() => {
              if (userPass1 == userPass2 && userPass1.length < 8) {
                alert("Password must be 8 characters minimum");
              } else if (userPass1 != userPass2) {
                alert("Passwords do not match");
              } else if (userEmail.length < 1) {
                alert("Invalid email address");
              } else if (userFirstName.length < 1 || userLastName.length < 1) {
                alert("Name field missing");
              } else {
                data.first_name = userFirstName;
                data.last_name = userLastName;
                data.email = userEmail;
                data.password_hash = userPass1;
                dispatch(registerUserThunk(data));
              }
            }}
          >
            Sign in
          </Button>
        </VStack>
      </Box>
    </Center>
  );
}
