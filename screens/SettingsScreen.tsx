import { Button, StyleSheet, Image } from "react-native";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { User } from "../interfaces";

import { Text, View } from "../components/Themed";
import React from "react";

export default function SettingsScreen() {
  const [userData, setUserData] = useState<User[]>([]);

  const [buttonClicked, setButtonClicked] = useState(false);

  console.log("User data ", userData);

  const update = () => {
    axios
      .get<User[]>("http://10.0.2.2:8080/parking/user")
      .then((response: AxiosResponse) => {
        console.log("Response ", response.data);
        setUserData(response.data);
      });
  };

  useEffect(() => {
    axios
      .get<User[]>("http://10.0.2.2:8080/parking/user")
      .then((response: AxiosResponse) => {
        console.log("Response ", response.data);
        setUserData(response.data);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Settings currently used for testing get API request:
      </Text>
      <Button
        title="Click to fetch data"
        onPress={() => {
          update();
          setButtonClicked(true);
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
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
