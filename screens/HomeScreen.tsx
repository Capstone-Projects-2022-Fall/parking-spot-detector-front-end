import { useEffect, useState } from "react";
import { Image, StyleSheet } from "react-native";
import { Text, View } from "../components/Themed";
import { useAppSelector } from "../hooks/hooks";
import store from "../redux/store";
import { RootTabScreenProps } from "../types";

export default function HomeScreen({
  navigation,
}: RootTabScreenProps<"TabOne">) {
  const user = useAppSelector((state) => state.user);
  console.log(JSON.stringify(user));

  useEffect(() => {
    // do stuff
  }, [user]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Welcome {user.name}
        {"\n"}Email: {user.email}
        {"\n"}Username: {user.username}
        {"\n"}City: {user.address?.city}
        {"\n"}LoginStatus: {user.status}
      </Text>
      <Image
        source={require("../assets/images/parking_spot_logo.png")}
        style={{ width: "80%", resizeMode: "contain" }}
      />
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <Text>Open settings to test connection to local API.</Text>
      <Text>Open profile to test connection to jsonplaceholder.com API.</Text>

      {/* <EditScreenInfo path="/screens/HomeScreen.tsx" /> */}
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
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
