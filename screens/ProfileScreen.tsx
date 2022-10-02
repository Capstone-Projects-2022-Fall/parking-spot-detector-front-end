import { Button, StyleSheet, Image } from "react-native";
import axios from "../api/axios";
import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { User } from "../interfaces";

import { Text, View } from "../components/Themed";
import React from "react";
import { RootTabScreenProps } from "../types";

// Use this for registration screen.
// export default function SettingsScreen({ navigation }: RootTabScreenProps<"TabTwo">) {

export default function ProfileScreen({
  navigation,
}: RootTabScreenProps<"TabTwo">) {
  const [userData, setUserData] = useState<User[]>([]);
  //const [inputText, setInputText] = useState<string>("");

  const [buttonClicked, setButtonClicked] = useState(false);
  console.log("User data ", userData);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Screen</Text>
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
    justifyContent: "center",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
