import { StyleSheet, Dimensions, Platform, Linking } from "react-native";
import { useEffect, useState } from "react";
import { Text, View } from "../components/Themed";
import { RootTabScreenProps } from "../types";
import { Button } from "native-base";
import * as Location from "expo-location";
import * as React from "react";

import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { useAppSelector } from "../hooks/hooks";

/**
 * The NavigationScreen is used to show the map of the users current location and the nearest parking available from the
 * push notification. It also allows the user to navigate to the nearest open parking location if available and opens
 * directions in google maps.
 * @param RootTabScreenProps The root tab props needed for the bottom tabs navigation.
 * @returns The view of the navigation screen.
 */
export default function NavigationScreen({
  navigation,
}: RootTabScreenProps<"TabThree">) {
  const [location, setLocation] = useState<Location.LocationObject>();
  const [delta, setDelta] = useState([0.004, 0.007]);

  // TODO use this to update marker on map and change lat and long delta to match distance between them.
  const parking = useAppSelector((state) => state.parking);

  const mapRef = React.createRef<MapView>();
  const markerRef = React.createRef<Marker>();
  const parkingMarkerRef = React.createRef<Marker>();

  const [mapRegion, setmapRegion] = useState({
    latitude: 39.9826281,
    longitude: -75.1629567,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

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

        latitudeDelta: parking.parkingAval
          ? (Math.max(parking.coordinates[0], location.coords.latitude) -
              Math.min(parking.coordinates[0], location.coords.latitude)) *
            Math.PI
          : delta[0],
        longitudeDelta: parking.parkingAval
          ? (Math.max(parking.coordinates[1], location.coords.longitude) -
              Math.min(parking.coordinates[1], location.coords.longitude)) *
            Math.PI
          : delta[1],
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
        <Marker
          image={require("../assets/images/car.png")}
          coordinate={{
            latitude: Number(
              isNaN(Number(location?.coords.latitude))
                ? 0.0
                : location?.coords.latitude
            ),
            longitude: Number(
              isNaN(Number(location?.coords.longitude))
                ? 0.0
                : location?.coords.longitude
            ),
          }}
          title="Current Location"
        />
        <Marker
          ref={parkingMarkerRef}
          image={
            !parking.parkingAval
              ? require("../assets/images/transparent_small.png")
              : require("../assets/images/parking_marker_150px.png")
          }
          coordinate={{
            latitude: parking.coordinates[0],
            longitude: parking.coordinates[1],
          }}
          title="Parking"
        />
      </MapView>
      <Button
        mt="2"
        colorScheme="purple"
        onPress={() => {
          if (parking.parkingAval) {
            Linking.openURL(
              "https://www.google.com/maps/dir/?api=1&destination=" +
                parking.coordinates[0] +
                "," +
                parking.coordinates[1] +
                "&dir_action=navigate"
            );
          } else {
            alert("No parking available");
          }
        }}
      >
        Navigate to Location
      </Button>
      <Text>
        Latitude: {location?.coords.latitude} {"\n"} Longitude:
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
    height: "75%",
  },
});
