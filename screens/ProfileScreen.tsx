import { Button, StyleSheet, Image } from "react-native";
import axios from "axios";
import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { UserSample } from "../interfaces";

import { Text, View } from "../components/Themed";
import React from "react";
import { RootTabScreenProps } from "../types";

// Use this for registration screen.
// export default function SettingsScreen({ navigation }: RootTabScreenProps<"TabTwo">) {

export default function ProfileScreen({
  navigation,
}: RootTabScreenProps<"TabTwo">) {
  const [userData, setUserData] = useState<UserSample[]>([]);
  //const [inputText, setInputText] = useState<string>("");

  const [buttonClicked, setButtonClicked] = useState(false);
  console.log("User data ", userData);

  const update = () => {
    axios
      .get<UserSample[]>("https://jsonplaceholder.typicode.com/users")
      .then((response: AxiosResponse) => {
        console.log("Response ", response.data);
        setUserData(response.data);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Sample user data from jsonplaceholder.com
      </Text>
      <Button
        title="Click to fetch data"
        onPress={() => {
          update();
          setButtonClicked(true);
        }}
      />
      <Text></Text>
      <Button
        title="Clear data"
        onPress={() => {
          setButtonClicked(false);
          setUserData([]);
        }}
      />
      <View style={styles.container}>
        {buttonClicked == true ? (
          <Text>{JSON.stringify(userData[0])}</Text>
        ) : null}

        {buttonClicked == true ? (
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
            }}
            style={{ width: 200, height: 200, marginTop: 20 }}
          />
        ) : null}
      </View>
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
