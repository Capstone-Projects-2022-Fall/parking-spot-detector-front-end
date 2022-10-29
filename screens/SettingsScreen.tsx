import { StyleSheet, Dimensions } from "react-native";
import { useEffect, useState } from "react";
import { Text, View } from "../components/Themed";
import { RootTabScreenProps } from "../types";
import * as Location from "expo-location";
import * as React from "react";

import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";

// Use this for registration screen.
// export default function SettingsScreen({ navigation }: RootTabScreenProps<"TabTwo">) {

export default function SettingsScreen({
  navigation,
}: RootTabScreenProps<"TabThree">) {
  const [location, setLocation] = useState<Location.LocationObject>();
  const [delta, setDelta] = useState([0.004, 0.007]);

  const mapRef = React.createRef<MapView>();
  const markerRef = React.createRef<Marker>();

  const [mapRegion, setmapRegion] = useState({
    latitude: 39.9826281,
    longitude: -75.1629567,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const homeRegion = {
    latitude: 39.98254635424615,
    longitude: -75.16293123076989,
    latitudeDelta: delta[0],
    longitudeDelta: delta[1],
  };

  useEffect(() => {
    (async () => {
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,

        timeInterval: 1500,
      });

      mapRef.current?.animateToRegion(mapRegion);

      markerRef.current?.animateMarkerToCoordinate({
        latitude: Number(location?.coords.latitude),
        longitude: Number(location?.coords.longitude),
      });

      setmapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: delta[0],
        longitudeDelta: delta[1],
      });

      setLocation(location);
    })();
  }, [location]);

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        initialRegion={mapRegion}
        mapType="hybrid"
        style={styles.map}
        ref={mapRef}
      >
        {/* <Polyline
          coordinates={[mapRegion, homeRegion]}
          strokeWidth={5}
          strokeColor="#00a8ff"
        /> */}
        <Marker
          image={require("../assets/images/target.png")}
          coordinate={{
            latitude: Number(location?.coords.latitude),
            longitude: Number(location?.coords.longitude),
          }}
          title="Marker"
        />
      </MapView>
      <Text>
        Latitude: {location?.coords.latitude} Longitude:{" "}
        {location?.coords.longitude}
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
  map: {
    width: Dimensions.get("window").width,
    height: "80%",
  },
});
