import { Image, StyleSheet } from "react-native";
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
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>
          Welcome {user.first_name} {user.last_name}
          {"\n"}Email: {user.email}
          {"\n"}Address: {user.address}
          {"\n"}Phone number: {formatPhoneNumber(user.phone_number)}
          {"\n"}Handicap status: {String(user.handicap)}
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
        <Text>Open profile tab to update your information</Text>
      </View>
      {/* <EditScreenInfo path="/screens/HomeScreen.tsx" /> */}
      <ParkingMapView />
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
