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
 * directions in google maps. Icon removed and view centers if false is recieved from parking.aval.
 * @param RootTabScreenProps The root tab props needed for the bottom tabs navigation.
 * @returns The view of the navigation screen.
 */
export default function NavigationScreen({
  navigation,
}: RootTabScreenProps<"TabThree">) {
  const [location, setLocation] = useState<Location.LocationObject>();
  const [delta, setDelta] = useState([0.004, 0.007]); // May be used to change zoom buffer around markers on map.

  const parking = useAppSelector((state) => state.parking); // The parking state object updated from notification or background click event.

  const mapRef = React.createRef<MapView>();
  const markerRef = React.createRef<Marker>(); // Current user location marker (car).
  const parkingMarkerRef = React.createRef<Marker>(); // Parking marker if available, transparent if not.

  // Initial map region before location is updated.
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

      // The initial map view for current region before location is updated (just in case).
      mapRef.current?.animateToRegion(mapRegion);

      // The current user location marker.
      markerRef.current?.animateMarkerToCoordinate({
        latitude: Number(location?.coords.latitude),
        longitude: Number(location?.coords.longitude),
      });

      setmapRegion({
        // The current user location to center the map on.
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,

        // Create enough of a zoom buffer to show both user location and parking location * extra (extra is delta use state).
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
  }, [location, parking.parkingAval]); // Update map if location or parking availability changes.

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
          image={require("../assets/images/car.png")} // current location
          coordinate={{
            latitude: Number(
              isNaN(Number(location?.coords.latitude)) // if not available set to 0.0 to avoid crash, usually only during initial emulator load and not visible.
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
          // image={  // Not working as expected: image too large on IOS and animate to region not working
          //   !parking.parkingAval // marker is transparent if no parking.
          //     ? require("../assets/images/transparent_small.png")
          //     : require("../assets/images/parking_marker_150px.png")
          // }
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
      {/* <Text>
        Latitude: {location?.coords.latitude} {"\n"} Longitude:
        {location?.coords.longitude}
      </Text> */}
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
