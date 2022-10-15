import { Button, StyleSheet, Image } from "react-native";
import { useState } from "react";
import { UserSample } from "../interfaces";
import { Text, View } from "../components/Themed";
import React from "react";
import { RootTabScreenProps } from "../types";
import { useAppDispatch } from "../hooks/hooks";
import { logoutUser } from "../redux/user/userSlice";
import { StackActions } from "@react-navigation/native";

// Use this for registration screen.
// export default function SettingsScreen({ navigation }: RootTabScreenProps<"TabTwo">) {

export default function ProfileScreen({
  navigation,
}: RootTabScreenProps<"TabTwo">) {
  const dispatch = useAppDispatch();

  return (
    <View style={styles.container}>
      <Button
        title="Logout"
        onPress={() => {
          dispatch(logoutUser());
          navigation.dispatch(StackActions.replace("SignIn"));
        }}
      />
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
