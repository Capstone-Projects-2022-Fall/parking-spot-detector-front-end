import { Button, StyleSheet, Image } from "react-native";
import axios from "../api/axios";
import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { Text, View } from "../components/Themed";
import React from "react";
import { RootTabScreenProps } from "../types";
import * as Location from "expo-location";
import { set } from "immer/dist/internal";

// Use this for registration screen.
// export default function SettingsScreen({ navigation }: RootTabScreenProps<"TabTwo">) {

export default function SettingsScreen({
  navigation,
}: RootTabScreenProps<"TabThree">) {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );

  const [address, setAddress] = useState<Location.LocationGeocodedAddress[]>(
    []
  );

  useEffect(() => {
    (async () => {
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      let place = await Location.reverseGeocodeAsync(location.coords);
      console.log(place);
      setAddress(place);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text>
        Lattitude: {location?.coords.latitude} {"   "}Longitude:
        {location?.coords.longitude}
      </Text>
      <Text>
        {address[0]?.streetNumber} {address[0]?.street}
      </Text>
      <Text>
        {address[0]?.city}, {address[0]?.region} {address[0]?.postalCode}
      </Text>
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
