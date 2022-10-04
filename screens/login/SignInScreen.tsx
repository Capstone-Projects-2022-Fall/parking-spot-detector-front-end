import { Text, View } from "../../components/Themed";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

import {
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  Platform,
} from "react-native";
import { useState } from "react";

export default function LoginScreen() {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
      <Text> *Click login to go to the home page*</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Enter email"
          placeholderTextColor="#003f5c"
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
          navigation.navigate("Root");
          console.log(email + " " + password);
        }}
      >
        <Text>Click to login</Text>
      </TouchableHighlight>

      <TouchableOpacity style={styles.forgot_button}>
        <Text>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity>
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
    // marginBottom: 40,
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
