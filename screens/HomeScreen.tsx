import {
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from "react-native";
import { Text, View } from "../components/Themed";
import { formatPhoneNumber } from "../constants/Formatters";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { RootTabScreenProps } from "../types";
import ParkingMapView from "../components/ParkingMapView";

/* IF YOU'RE READING THIS, THIS IS WHAT YOU SEE FROM MAPVIEW */

import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import React, { useState, useEffect, useRef } from "react";
import { Platform } from "react-native";
import { Subscription } from "expo-modules-core";
import { Parking } from "../redux/parking/index";
import { currentParking } from "../redux/parking/parking";
import { registerPushTokenThunk } from "../redux/user/userSlice";

// ExponentPushToken[X7REOHMNL5IcMAkMS71A8v] on my device for testing

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function HomeScreen({
  navigation,
}: RootTabScreenProps<"TabOne">) {
  //****************image refresh ********************* */

  const imgUrlSample = "https://picsum.photos/200#";
  const imgUrlSample2 =
    "https://images.unsplash.com/photo-1545179605-1296651e9d43?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=20#";

  const serverFrameUrl =
    "https://parkingspotdetector-env.eba-mmwgffbe.us-east-1.elasticbeanstalk.com/cameras/635f5bebad2e8de576523e78/latest";

  const [imageURL, setImage] = useState(serverFrameUrl);

  //************ User store****************** */
  const user = useAppSelector((state) => state.user);

  /************* Notification ************* */
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>("");
  const notificationListener = useRef<Subscription>();
  const responseListener = useRef<Subscription>();

  const dispatch = useAppDispatch();
  const parking = useAppSelector((state) => state.parking);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token);

      if (token !== undefined && token?.length > 1) {
        dispatch(registerPushTokenThunk([String(user.id), token]));
      }

      console.log(token);
    });

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        let parkingFromNotification: Parking = JSON.parse(
          notification && JSON.stringify(notification.request.content.data)
        );
        dispatch(currentParking(parkingFromNotification));
      });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    // This will set the redux store parking object as well as the notification use state object when pressed to persist data when app is in background.
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response: any) => {
        let parkingFromNotification: Parking = JSON.parse(
          response.notification &&
            JSON.stringify(response.notification.request.content.data)
        );
        dispatch(currentParking(parkingFromNotification));
        console.log(response.notification.request.content.data);
        navigation.navigate("TabThree");
      });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [parking]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView bounces={false} style={styles.scroll}>
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
          <Text>Your expo push token: {expoPushToken}</Text>
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Text>
              Title: {notification && notification.request.content.title}{" "}
            </Text>
            <Text>
              Body: {notification && notification.request.content.body}
            </Text>
            <Text>Data: {JSON.stringify(parking)}</Text>
          </View>
          {/* The button to send notification using fetch requests in notification.ts */}
          {/* <Button
        title="Press to Send Notification"
        onPress={async () => {
          await sendPushNotification(expoPushToken);
        }}
      /> */}
          <View
            style={styles.separator}
            lightColor="#eee"
            darkColor="rgba(255,255,255,0.1)"
          />
          <Image
            style={styles.image}
            source={{ uri: "https://picsum.photos/200/300" }}
          />
          <Text>Open profile tab to update your information {"\n"}</Text>
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

async function registerForPushNotificationsAsync() {
  let token = "";
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],

      lightColor: "#FF231F7C",
    });
  }

  return token;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: Dimensions.get("window").width * 1.05,
  },
  scroll: {
    backgroundColor: "purple",
  },
  home: {
    padding: "10%",
  },
  logo: {
    width: "60%",
    resizeMode: "contain",
    backgroundColor: "white",
    borderRadius: 15,
    height: 30,
    padding: "12% 0%",
    margin: "20% 0%",
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
    padding: "2.5%",
  },
  image: {
    resizeMode: "contain",
    width: Dimensions.get("window").width - 20,
    height: 300,
  },
});
