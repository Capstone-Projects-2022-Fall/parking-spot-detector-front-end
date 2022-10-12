import { Text, View } from "../../components/Themed";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  Platform,
} from "react-native";
import { Button } from "native-base";
import { useAppDispatch } from "../../hooks/hooks";
import { registerUser } from "../../redux/user/userSlice";
import { User } from "../../redux/user/index";

export default function RegisterScreen() {
  var user: User = {
    userId: 0,
    userName: "testName",
    email: "testMail",
    password: "testPass",
    phone: 5555555555,
  };

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPass, setUserPass] = useState("");
  const [userPhone, setUserPhone] = useState(0);

  var dispatch = useAppDispatch();
  return (
    <View style={styles.container}>
      <Text style={styles.title}> Parking Spot Detector</Text>

      <Image
        style={styles.image}
        source={require("../../assets/images/parking_logo.png")}
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        autoCapitalize="none"
        placeholderTextColor="white"
        onChangeText={(val) => setUserName(val)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        autoCapitalize="none"
        placeholderTextColor="white"
        onChangeText={(val) => setUserEmail(val)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        placeholderTextColor="white"
        onChangeText={(val) => setUserPass(val)}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        autoCapitalize="none"
        placeholderTextColor="white"
        onChangeText={(val) => setUserPhone(Number(val))}
      />
      <Button
        style={styles.regBtn}
        onPress={() => {
          dispatch(registerUser(user));
        }}
      >
        {" "}
        Register{" "}
      </Button>
    </View>
  );
}

// export default class SignUp extends React.Component {
//   state = {
//     username: "",
//     password: "",
//     email: "",
//     phone_number: "",
//   };
//   onChangeText = (key: string, val: string) => {
//     this.setState({ [key]: val });
//   };
//   signUp = async () => {
//     const { username, password, email, phone_number } = this.state;
//     try {
//       // here place your signup logic
//       console.log("user successfully signed up!: ");
//     } catch (err) {
//       console.log("error signing up: ", err);
//     }
//   };

//   render() {
//     var user: User = {
//       userName: "testName",
//       email: "testMail",
//       password: "testPass",
//       phone: 5555555555,
//     };

//     var dispatch = useAppDispatch();
//     return (
//       <View style={styles.container}>
//         <Text style={styles.title}> Parking Spot Detector</Text>

//         <Image
//           style={styles.image}
//           source={require("../../assets/images/parking_logo.png")}
//         />
//         <TextInput
//           style={styles.input}
//           placeholder="Username"
//           autoCapitalize="none"
//           placeholderTextColor="white"
//           onChangeText={(val) => this.onChangeText("username", val)}
//         />
//         <TextInput
//           style={styles.input}
//           placeholder="Password"
//           secureTextEntry={true}
//           autoCapitalize="none"
//           placeholderTextColor="white"
//           onChangeText={(val) => this.onChangeText("password", val)}
//         />
//         <TextInput
//           style={styles.input}
//           placeholder="Email"
//           autoCapitalize="none"
//           placeholderTextColor="white"
//           onChangeText={(val) => this.onChangeText("email", val)}
//         />
//         <TextInput
//           style={styles.input}
//           placeholder="Phone Number"
//           autoCapitalize="none"
//           placeholderTextColor="white"
//           onChangeText={(val) => this.onChangeText("phone_number", val)}
//         />
//         <Button
//           style={styles.regBtn}
//           onPress={() => {
//             dispatch(registerUser(user));
//             this.signUp;
//           }}
//         >
//           {" "}
//           Register{" "}
//         </Button>
//       </View>
//     );
//   }
// }

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
  },

  image: {
    width: "50%",
    resizeMode: "contain",
    // marginBottom: 40,
  },
});
