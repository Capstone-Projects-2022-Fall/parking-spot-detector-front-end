import { Button, StyleSheet, Image } from "react-native";
import axios from "../api/axios";
import { AxiosResponse } from "axios";
import { useState } from "react";
import { UserSample } from "../interfaces";

import { Text, View } from "../components/Themed";
import React from "react";
import { RootTabScreenProps } from "../types";

// Use this for registration screen.
// export default function SettingsScreen({ navigation }: RootTabScreenProps<"TabTwo">) {

export default function SettingsScreen({
  navigation,
}: RootTabScreenProps<"TabThree">) {
  const [userData, setUserData] = useState<UserSample[]>([]);
  //const [inputText, setInputText] = useState<string>("");

  const [buttonClicked, setButtonClicked] = useState(false);
  console.log("User data ", userData);

  const update = () => {
    axios.get<UserSample[]>("parking/user").then((response: AxiosResponse) => {
      console.log("Response ", response.data);
      setUserData(response.data);
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Settings currently used for testing GET API requests: BaseURL:
        "http://10.0.2.2:8080" Go to ../api/axios to change
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
        {buttonClicked == true ? <Text>{JSON.stringify(userData)}</Text> : null}

        {buttonClicked == true ? (
          <Image
            source={{
              uri: "http://10.0.2.2:8080/parking/image",
            }}
            style={{ width: 300, height: 300, marginTop: 20 }}
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
