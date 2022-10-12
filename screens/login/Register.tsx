import { Text, View } from "../../components/Themed";
import React, { useEffect, useState } from "react";
import { StyleSheet, TextInput } from "react-native";
import { Button, Center } from "native-base";
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
    <View style={styles.container}>
      <Center w="100%">
        <Text style={styles.title}>
          {" "}
          Parking Spot Detector{"\n"}Registration
        </Text>

        <TextInput
          style={styles.input}
          placeholder="First name"
          autoCapitalize="none"
          placeholderTextColor="#003f5c"
          onChangeText={(val) => setFirstName(val)}
        />
        <TextInput
          style={styles.input}
          placeholder="Last name"
          autoCapitalize="none"
          placeholderTextColor="#003f5c"
          onChangeText={(val) => setLastName(val)}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          placeholderTextColor="#003f5c"
          onChangeText={(val) => setUserEmail(val)}
        />
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
        <Button
          style={styles.regBtn}
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
              dispatch(registerUserThunk(data));
            }
          }}
        >
          Register
        </Button>
      </Center>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    width: "70%",

    backgroundColor: "#C19FDE",
    margin: 10,
    padding: 8,
    color: "white",
    borderRadius: 14,
    fontSize: 18,
    fontWeight: "500",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  regBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
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
  },
});
