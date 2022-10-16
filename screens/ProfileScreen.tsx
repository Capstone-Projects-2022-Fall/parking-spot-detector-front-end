import { StyleSheet, Switch, TextInput, TouchableOpacity } from "react-native";
import { useRef, useState } from "react";

import { Text, View } from "../components/Themed";
import React from "react";
import { RootTabScreenProps } from "../types";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import {
  deleteUserThunk,
  logoutUser,
  updateUserProfileThunk,
} from "../redux/user/userSlice";
import { StackActions } from "@react-navigation/native";
import { Center } from "native-base";
import { HStack } from "native-base";
import { ScrollView } from "react-native";
import { formatPhoneNumber } from "../constants/Formatters";

export default function ProfileScreen({
  navigation,
}: RootTabScreenProps<"TabTwo">) {
  const dispatch = useAppDispatch();

  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const user = useAppSelector((state) => state.user);
  let data = { ...user }; // Copy of user data from store. Also used as data sent to update user thunk.

  const [userFirstName, setFirstName] = useState(data.first_name);
  const [userLastName, setLastName] = useState(data.last_name);
  const [userEmail, setUserEmail] = useState(data.email);
  const [userPass1, setUserPass1] = useState("");
  const [userPass2, setUserPass2] = useState("");
  const [userAddress, setUserAddress] = useState(data.address);
  const [userPhone, setUserPhone] = useState(data.phone_number);
  const [isEnabled, setIsEnabled] = useState(data.handicap);

  return (
    <ScrollView>
      <View style={styles.container}>
        <Center w="100%">
          <Text style={styles.title}>
            {" "}
            Parking Spot Detector{"\n"} Update Profile
          </Text>
          <HStack alignItems="center" space={4}>
            <Text>Handicap?</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={isEnabled ? "#7059A3" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </HStack>
          <TextInput
            style={styles.input}
            placeholder="First name"
            value={userFirstName}
            autoCapitalize="none"
            placeholderTextColor="#003f5c"
            onChangeText={(val) => setFirstName(val)}
          />
          <TextInput
            style={styles.input}
            placeholder="Last name"
            value={userLastName}
            autoCapitalize="none"
            placeholderTextColor="#003f5c"
            onChangeText={(val) => setLastName(val)}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            textContentType="emailAddress"
            value={userEmail}
            autoCapitalize="none"
            placeholderTextColor="#003f5c"
            onChangeText={(val) => setUserEmail(val)}
          />

          <TextInput
            style={styles.input}
            placeholder="Phone number"
            textContentType="telephoneNumber"
            dataDetectorTypes="phoneNumber"
            keyboardType="phone-pad"
            maxLength={14}
            value={formatPhoneNumber(userPhone)}
            placeholderTextColor="#003f5c"
            onChangeText={(val) => setUserPhone(formatPhoneNumber(val))}
          />
          <TextInput
            style={styles.input}
            placeholder="Address"
            value={userAddress}
            autoCapitalize="none"
            placeholderTextColor="#003f5c"
            onChangeText={(val) => setUserAddress(val)}
          />
          <Text>*Leave passwords empty if not updating*</Text>
          <TextInput
            style={styles.input}
            placeholder="Password"
            autoCapitalize="none"
            placeholderTextColor="#003f5c"
            secureTextEntry={true}
            onChangeText={(val) => setUserPass1(val)}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            autoCapitalize="none"
            placeholderTextColor="#003f5c"
            secureTextEntry={true}
            onChangeText={(val) => setUserPass2(val)}
          />
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => {
              if (
                userPass1 != "" &&
                userPass2 != "" &&
                userPass1 == userPass2 &&
                userPass1.length < 8
              ) {
                alert(
                  "Password must be 8 characters minimum or empty if not updating"
                );
              } else if (userPass1 != userPass2) {
                alert("Passwords do not match");
              } else if (userEmail.length < 1) {
                alert("Invalid email address");
              } else if (userFirstName.length < 1 || userLastName.length < 1) {
                alert("Name field missing");
              } else if (userAddress.length < 1) {
                alert("Invalid address");
              } else if (userPhone.length < 10) {
                alert("Invalid phone number");
              } else {
                data.first_name = userFirstName;
                data.last_name = userLastName;
                data.address = userAddress;
                data.phone_number = userPhone;
                data.handicap = isEnabled;
                data.email = userEmail;
                data.password_hash = userPass1;
                // Update in server, if password is supplied it will be hashed in the thunk.
                dispatch(updateUserProfileThunk(data));
              }
            }}
          >
            <Text>Update</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => {
              dispatch(logoutUser());
              navigation.dispatch(StackActions.replace("SignIn"));
            }}
          >
            <Text>Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => {
              // Delete user profile on server.
              dispatch(deleteUserThunk(user));
              // Logout to start with initial state.
              dispatch(logoutUser());
              // Return to sign in screen.
              navigation.dispatch(StackActions.replace("SignIn"));
            }}
          >
            <Text>Delete</Text>
          </TouchableOpacity>
        </Center>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  input: {
    width: "70%",

    backgroundColor: "#C19FDE",
    margin: 10,
    padding: 8,
    color: "white",
    borderRadius: 30,
    fontSize: 18,
    fontWeight: "500",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "red",
  },
  logoutBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#7059A3",
  },

  title: {
    fontSize: 30,
    textAlign: "center",
  },

  image: {
    width: "50%",
    resizeMode: "contain",
    // marginBottom: 40,
  },
});
