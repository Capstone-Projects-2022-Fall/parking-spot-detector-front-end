import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Center,
  FormControl,
  Heading,
  Input,
  Link,
  VStack,
} from "native-base";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { logoutUser, registerUserThunk } from "../../redux/user/userSlice";
import { initialState, LoginStatus } from "../../redux/user/index";
import { StackActions, useNavigation } from "@react-navigation/native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

/**
 * The RegisterScreen provides the form, navigation, input validation for user registration.
 * @returns The registration screen view.
 */
export default function RegisterScreen() {
  const [username, setUsername] = useState("");

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
      setUsername("");
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
            <FormControl.Label>Username</FormControl.Label>
            <Input onChangeText={(val) => setUsername(val)} />
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
              } else if (username.length < 1) {
                alert("Username field missing");
              } else {
                data.username = username;
                data.email = userEmail;
                data.password = userPass1;
                registerForPushNotificationsAsync().then((token) => {
                  if (token !== undefined && token?.length > 1) {
                    data.push_token = token;
                    console.log(data.push_token);
                  }
                });
                dispatch(registerUserThunk(data));
              }
            }}
          >
            Register
          </Button>
        </VStack>
      </Box>
    </Center>
  );
}

async function registerForPushNotificationsAsync() {
  let token = "";
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],

      lightColor: "#FF231F7C",
    });
  }

  return token;
}
