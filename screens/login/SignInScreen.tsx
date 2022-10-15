import { Text, View } from "../../components/Themed";
import { useNavigation, StackActions } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { fetchUserThunk } from "../../redux/user/userSlice";

import {
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  Platform,
} from "react-native";
import { useEffect, useState } from "react";
import { LoginStatus } from "../../redux/user";

/**
 * The SignInScreen contains the view and functionality for user sign in.
 * @returns {View} SignInScreen
 */
export default function SignInScreen() {
  const navigation = useNavigation();

  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Listen for changes on user.status and allow login if credentials match.
  useEffect(() => {
    if (user.status == LoginStatus.SUCCEEDED) {
      setEmail("");
      setPassword("");
      navigation.dispatch(StackActions.replace("Root"));
    }
    // } else if (
    //   user.status == LoginStatus.SUCCEEDED &&
    //   password != user.username &&
    //   user.id != 0
    // ) {
    //   alert("Incorrect password");
    // }
  }, [user.status]);

  return (
    <View
      style={styles.container}
      lightColor="#eee"
      darkColor="rgba(255,255,255,0.1)"
    >
      <Text style={styles.title}> Parking Spot Detector</Text>

      <Image
        style={styles.image}
        source={require("../../assets/images/parking_logo.png")}
      />
      <Text style={{ color: "red" }}>
        Test Login{"\n"}use: email=test@email.com password=password"
      </Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Enter email"
          placeholderTextColor="#003f5c"
          autoComplete="email"
          onChangeText={(text) => setEmail(text)}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Enter password"
          placeholderTextColor="#003f5c"
          secureTextEntry={true}
          onChangeText={(text) => setPassword(text)}
        />
      </View>
      <TouchableHighlight
        style={styles.loginBtn}
        onPress={() => {
          dispatch(fetchUserThunk([email, password]));
          console.log("Email: " + email + " " + "Password: " + password);
        }}
      >
        <Text>Click to login</Text>
      </TouchableHighlight>

      <TouchableOpacity
        style={styles.forgot_button}
        onPress={() => navigation.navigate("Root")}
      >
        <Text>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Registration");
        }}
      >
        <Text style={styles.register_button}>New User? Register</Text>
      </TouchableOpacity>
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 30,
  },

  image: {
    width: "50%",
    resizeMode: "contain",
  },

  inputView: {
    backgroundColor: "#C19FDE",
    borderRadius: 30,
    width: "70%",
    height: 45,
    marginBottom: 10,
    marginTop: 5,

    alignItems: "center",
  },

  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    textAlign: "center",
  },

  forgot_button: {
    height: 20,
    marginBottom: 10,
  },

  register_button: {
    height: 30,
    marginBottom: 10,
    marginTop: 10,
  },

  loginBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    marginBottom: 10,
    backgroundColor: "#7059A3",
  },
});
