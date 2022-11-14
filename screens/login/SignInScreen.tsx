import { useNavigation, StackActions } from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { fetchUserThunk } from "../../redux/user/userSlice";

import { StyleSheet, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { LoginStatus } from "../../redux/user";
import {
  Box,
  Button,
  Center,
  FormControl,
  Heading,
  HStack,
  Input,
  Link,
  VStack,
  Text,
} from "native-base";

/**
 * The SignInScreen contains the view and functionality for user sign in.
 * @returns {View} SignInScreen
 */
export default function SignInScreen() {
  const navigation = useNavigation();

  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Listen for changes on user.status and allow login if credentials match.
  useEffect(() => {
    if (user.status == LoginStatus.SUCCEEDED) {
      setUsername("");
      setPassword("");
      navigation.dispatch(StackActions.replace("Root"));
    }
  }, [user.status]);

  return (
    <Center w="100%">
      <Box safeArea p="2" py="8" w="90%" maxW="290">
        <Heading
          size="lg"
          alignSelf={"center"}
          fontWeight="600"
          color="coolGray.800"
          _dark={{
            color: "warmGray.50",
          }}
        >
          Parking Spot Detector
        </Heading>
        <Image
          style={styles.image}
          source={require("../../assets/images/parking_logo.png")}
        />

        <Heading
          mt="1"
          _dark={{
            color: "warmGray.200",
          }}
          color="coolGray.600"
          fontWeight="medium"
          size="xs"
        >
          Sign in to continue! {"\n"}
          username: username and password: password
        </Heading>

        <VStack space={3} mt="5">
          <FormControl>
            <FormControl.Label>Username</FormControl.Label>
            <Input
              autoCapitalize="none"
              onChangeText={(text) => setUsername(text)}
            />
          </FormControl>
          <FormControl>
            <FormControl.Label>Password</FormControl.Label>
            <Input type="password" onChangeText={(text) => setPassword(text)} />
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
              dispatch(fetchUserThunk([username, password]));
              console.log("Email: " + username + " " + "Password: " + password);
            }}
          >
            Sign in
          </Button>
          <HStack mt="6" justifyContent="center">
            <Text
              fontSize="sm"
              color="coolGray.800"
              _dark={{
                color: "warmGray.200",
              }}
            >
              I'm a new user.{" "}
            </Text>
            <Link
              _text={{
                color: "purple.800",
                fontWeight: "medium",
                fontSize: "sm",
              }}
              onPress={() => {
                navigation.navigate("Registration");
              }}
            >
              Sign Up
            </Link>
          </HStack>
        </VStack>
      </Box>
    </Center>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "70%",
    height: 200,
    resizeMode: "contain",
    alignSelf: "center",
  },
});
