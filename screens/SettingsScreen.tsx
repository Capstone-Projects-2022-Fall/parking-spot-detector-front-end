import { StyleSheet, Dimensions } from "react-native";
import { useEffect, useState } from "react";
import { Text, View } from "../components/Themed";
import { RootTabScreenProps } from "../types";
import * as Location from "expo-location";
import * as React from "react";

import MapView, { Marker } from "react-native-maps";

// Use this for registration screen.
// export default function SettingsScreen({ navigation }: RootTabScreenProps<"TabTwo">) {

export default function SettingsScreen({
  navigation,
}: RootTabScreenProps<"TabThree">) {
  const [location, setLocation] = useState<Location.LocationObject>();

  const mapRef = React.createRef<MapView>();
  const markerRef = React.createRef<Marker>();

  const [mapRegion, setmapRegion] = useState({
    latitude: 39.9826281,
    longitude: -75.1629567,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  // const [address, setAddress] = useState<Location.LocationGeocodedAddress[]>(
  //   []
  // );

  useEffect(() => {
    (async () => {
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,

        timeInterval: 10,
      });
      mapRef.current?.animateCamera({
        center: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        zoom: 16,
        // heading: Number(location.coords.heading),
      });

      // mapRef.current?.animateToRegion(mapRegion);

      markerRef.current?.animateMarkerToCoordinate({
        latitude: Number(location?.coords.latitude),
        longitude: Number(location?.coords.longitude),
      });

      setLocation(location);
    })();
  }, [location]);

  return (
    <View style={styles.container}>
      <Text>
        Latitude: {location?.coords.latitude} Longitude:{" "}
        {location?.coords.longitude}
      </Text>
      <MapView
        mapType="satellite"
        style={styles.map}
        ref={mapRef}
        // initialRegion={mapRegion}
      >
        <Marker
          image={require("../assets/images/target.png")}
          coordinate={{
            latitude: Number(location?.coords.latitude),
            longitude: Number(location?.coords.longitude),
          }}
          title="Marker"
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    maxHeight: "50%",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
