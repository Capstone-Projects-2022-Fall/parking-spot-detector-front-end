import { useState, useEffect } from "react";
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from "react-native-maps";
import { StyleSheet, View, Dimensions } from "react-native";
import * as Location from "expo-location";
import Geocoder from "react-native-geocoding";
import { Text } from "../components/Themed";
import { GOOGLE_APIKEY, WEBSITE } from "../variables";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { Button } from "native-base";
//import { NativeStackNavigationProp } from "@react-navigation/native-stack";
//import { RootStackParamList } from '../types';

interface MapLocation {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

const Separator = () => {
  return <View style={styles.sep} />;
};

const ParkingMapView = () => {
  const navigation = useNavigation();

  const ZOOM = 0.0625;
  const [currLocation, setCurrLocation] =
    useState<Location.LocationObject | null>(null);

  useEffect(() => {
    (async () => {
      var location = await Location.getCurrentPositionAsync({});
      setCurrLocation(location);
    })();
  }, []);

  const lat = currLocation !== null ? currLocation.coords.latitude : 0.0,
    lng = currLocation !== null ? currLocation?.coords.longitude : 0.0;
  const region: MapLocation = {
    latitude: lat,
    longitude: lng,
    latitudeDelta: ZOOM,
    longitudeDelta: ZOOM,
  };

  /* when a button is selected */
  const [markerIsSelected, hasMarkerSelected] = useState(false);
  const [selectedMarkerProps, setSelectedMarkerProps] = useState({
    name: "",
    desc: "",
    address: "",
    spots: 0,
    latitude: 0,
    longitude: 0,
    public: "",
    hideFromMaps: false,
  });

  // last state, for refreshing Maps after adding marker
  const RAND = Math.floor(Math.random() * 100);
  const [randomKey, setRandomKey] = useState(RAND);

  const [markers, setMarkers] = useState([]);
  const MARKER_OPACITY = 0.875,
    MARKER_HIDE_HUE = "#ffad00",
    MARKER_NORMAL_HUE = "#49a429";

  useEffect(() => {
    const performGetRequest = () =>
      axios
        .get(`http://${WEBSITE}/parkingarea/`)
        .then(async (res) => {
          const data = res.data;
          const newMarkers = data.map((item: any, index: any) => {
            const {
                name,
                desc,
                hideFromMaps,
                address,
                latitude,
                longitude,
                spots,
              } = item,
              aBreak = address.indexOf(",");
            return (
              <Marker
                key={index}
                coordinate={{
                  latitude: latitude,
                  longitude: longitude,
                }}
                title={name}
                description={desc}
                opacity={MARKER_OPACITY}
                pinColor={hideFromMaps ? MARKER_HIDE_HUE : MARKER_NORMAL_HUE}
                onPress={(e) => {
                  hasMarkerSelected(true);
                  setSelectedMarkerProps(item);
                  console.log(e.nativeEvent.coordinate);
                }}
              >
                <Callout tooltip={true} style={styles.calloutContainer}>
                  <View>
                    <Text>
                      <Text style={{ fontWeight: "bold" }}>Address: </Text>
                      {address.substring(0, aBreak) +
                        "\n" +
                        address.substring(aBreak + 2)}
                    </Text>
                    <Text>
                      <Text style={{ fontWeight: "bold" }}>
                        Type of space:{" "}
                      </Text>
                      {item.public}
                    </Text>
                    <Text>
                      <Text style={{ fontWeight: "bold" }}>
                        Number of spots:{" "}
                      </Text>
                      {spots}
                    </Text>
                  </View>
                </Callout>
              </Marker>
            );
          });
          setMarkers(newMarkers);
          setRandomKey(Math.floor(Math.random() * 100));
        })
        .catch((err) => console.error(err));
    performGetRequest();
  }, []);

  Geocoder.init(GOOGLE_APIKEY);

  return (
    <>
      <View style={styles.container}>
        <MapView
          key={randomKey}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          showsUserLocation={true}
          region={region}
          loadingEnabled
          customMapStyle={mapStyles}
        >
          {markers}
        </MapView>
        <View
          style={{
            height: 80,
          }}
        >
          {markerIsSelected && (
            <>
              <Text style={{ fontWeight: "bold" }}>
                {selectedMarkerProps.address}
              </Text>

              <Button
                mt="2"
                colorScheme="purple"
                onPress={() => {
                  console.log(selectedMarkerProps);
                  navigation.navigate("MarkerInfo", {
                    parkingData: selectedMarkerProps,
                  });
                }}
              >
                Show More Info
              </Button>
            </>
          )}
        </View>
      </View>
      <Separator />

      <Button
        mt="2"
        colorScheme="purple"
        onPress={() => {
          navigation.navigate("CreateParkingAreaScreen");
        }}
      >
        Create Parking Area
      </Button>
    </>
  );
};

/* dimensions and styles for map view */
const TUNE = 0.5;
const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * TUNE,
  },
  sep: {
    marginVertical: 8,
    borderBottomColor: "#777",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  redirect: {
    backgroundColor: "#49a429",
    padding: "1.25%",
    borderRadius: 15,
    width: "90%",
    marginLeft: "2.5%",
  },
  createArea: {
    backgroundColor: "#8a00c2",
    padding: "1.25%",
    borderRadius: 15,
    width: "90%",
    marginLeft: "2.5%",
  },
  calloutContainer: {
    backgroundColor: "#cbc3e3",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 12,
    padding: 8,
  },
});

/* style components within Google Maps*/
const mapStyles = [
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#8a00c2" }],
  },
  {
    featureType: "road",
    elementType: "geometry.fill",
    stylers: [{ color: "#e8bcf0" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#8a00c2" }],
  },
  {
    featureType: "administrative.neighborhood",
    elementType: "labels.text.fill",
    stylers: [{ color: "#241571" }],
  },
];
// More info on styling Maps: https://developers.google.com/maps/documentation/javascript/style-reference

export default ParkingMapView;
