import { Image, StyleSheet, SafeAreaView, ScrollView, Dimensions } from "react-native";
import { Text, View } from "../components/Themed";
import { formatPhoneNumber } from "../constants/Formatters";
import { useAppSelector } from "../hooks/hooks";
import { RootTabScreenProps } from "../types";
import ParkingMapView from '../components/ParkingMapView';

export default function HomeScreen({
  navigation,
}: RootTabScreenProps<"TabOne">) {
  const user = useAppSelector((state) => state.user);
  console.log(JSON.stringify(user));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        bounces={false}
        style={styles.scroll}
      >
        <View style={styles.home}>
          <Image 
            style={styles.logo}
            source={require("../assets/images/parking_spot_logo.png")}
          />
          <Text style={styles.title}>
            Welcome {user.first_name} {user.last_name}
            {"\n"}Email: {user.email}
            {"\n"}Address: {user.address}
            {"\n"}Phone number: {formatPhoneNumber(user.phone_number)}
            {"\n"}Handicap status: {String(user.handicap)}
            {"\n"}LoginStatus: {user.status}
          </Text>
          <View
            style={styles.separator}
            lightColor="#eee"
            darkColor="rgba(255,255,255,0.1)"
          />
          <Text>Open profile tab to update your information {'\n'}</Text>
        </View>

        {/* <EditScreenInfo path="/screens/HomeScreen.tsx" /> */}

        <View style={styles.mapContainer}>
          <Text>Looking for a parking spot?</Text>
          <ParkingMapView />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: Dimensions.get('window').width * 1.05
  },
  scroll: {
    backgroundColor: 'purple'
  },
  home: {
    padding: '10%'
  },
  logo: {
    width: "60%", 
    resizeMode: "contain",
    backgroundColor: 'white',
    borderRadius: 15,
    height: 30,
    padding: '12% 0%',
    margin: '20% 0%',
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
  mapContainer: {
    padding: '2.5%'
  }
});
