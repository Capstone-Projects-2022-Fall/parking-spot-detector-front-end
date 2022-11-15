import { Switch } from "react-native";
import { useState } from "react";
import { Box, Button, FormControl, Input, VStack } from "native-base";
import { Text, useThemeColor } from "../components/Themed";
import { RootTabScreenProps } from "../types";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import {
  deleteUserThunk,
  logoutUser,
  updateUserProfileThunk,
} from "../redux/user/userSlice";
import { DarkTheme, StackActions } from "@react-navigation/native";
import { Center } from "native-base";
import { HStack } from "native-base";
import { formatPhoneNumber } from "../constants/Formatters";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_APIKEY } from "../variables";
import { Appearance } from "react-native";

/**
 * The profile screen provides the form to update the user profile, input validation, and screen navigation for
 * logout deletion and updating.
 * @param RootTabScreenProps The props for the root tabs.
 * @returns The profile screen view.
 */
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

  const locationField = userAddress == "" ? "Search for address" : userAddress;

  return (
    <Center w="100%">
      <Box safeArea p="2" py="1" w="90%" maxW="290">
        <HStack
          style={{ alignItems: "center", justifyContent: "space-evenly" }}
        >
          <Text>Handicap?</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isEnabled ? "#7059A3" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </HStack>
        <VStack>
          <FormControl>
            <FormControl.Label>First name</FormControl.Label>
            <Input
              value={userFirstName}
              onChangeText={(val) => setFirstName(val)}
            />
          </FormControl>
          <FormControl>
            <FormControl.Label>Last name</FormControl.Label>
            <Input
              value={userLastName}
              onChangeText={(val) => setLastName(val)}
            />
          </FormControl>
          <FormControl>
            <FormControl.Label>Email</FormControl.Label>
            <Input
              value={userEmail}
              onChangeText={(val) => setUserEmail(val)}
            />
          </FormControl>
          <FormControl>
            <FormControl.Label>Phone Number</FormControl.Label>
            <Input
              value={formatPhoneNumber(userPhone)}
              onChangeText={(val) => setUserPhone(formatPhoneNumber(val))}
            />
          </FormControl>
          <FormControl>
            <FormControl.Label>Address</FormControl.Label>
            <GooglePlacesAutocomplete
              styles={{
                container: {
                  flex: 0,
                },

                textInput: {
                  backgroundColor: useThemeColor,
                  color: Appearance.getColorScheme() == "dark" ? "#fff" : "000",
                  borderWidth: 1,
                  borderColor: "gray",
                  height: 36,
                  fontSize: 12,
                  fontWeight: "400",
                },
              }}
              placeholder={locationField}
              textInputProps={{
                placeholderTextColor: "gray",
                returnKeyType: "search",
              }}
              query={{
                key: GOOGLE_APIKEY,
                language: "en", // language of the results
              }}
              onPress={(data, details = null) => {
                setUserAddress(data.description);
                console.log(details);
              }}
              onFail={(error) => console.error(error)}
            />
          </FormControl>
          <FormControl>
            <FormControl.Label>Password - Only if changing</FormControl.Label>
            <Input type="password" onChangeText={(val) => setUserPass1(val)} />
            <FormControl.Label>Confirm Password</FormControl.Label>
            <Input type="password" onChangeText={(val) => setUserPass2(val)} />
          </FormControl>
          <HStack
            style={{ alignItems: "center", justifyContent: "space-evenly" }}
          >
            <Button
              mt="2"
              colorScheme="purple"
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
                } else if (
                  userFirstName.length < 1 ||
                  userLastName.length < 1
                ) {
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
                  data.password = userPass1;
                  // Update in server, if password is supplied it will be hashed in the thunk.
                  dispatch(updateUserProfileThunk(data));
                }
              }}
            >
              Update
            </Button>

            <Button
              mt="2"
              colorScheme="purple"
              onPress={() => {
                dispatch(logoutUser());
                // Return to sign in screen.
                navigation.dispatch(StackActions.replace("SignIn"));
              }}
            >
              Logout
            </Button>

            <Button
              mt="2"
              colorScheme="red"
              onPress={() => {
                // Delete user profile on server.
                dispatch(deleteUserThunk(user));
                // Logout to start with initial state.
                dispatch(logoutUser());
                // Return to sign in screen.
                navigation.dispatch(StackActions.replace("SignIn"));
              }}
            >
              Delete
            </Button>
          </HStack>
        </VStack>
      </Box>
    </Center>
  );
}
