// Can use this function below, OR use Expo's Push Notification Tool-> https://expo.dev/notifications
export async function sendPushNotification(expoPushToken: string | undefined) {
  const message = {
    to: expoPushToken,

    sound: "default",
    title: "Original Title",
    body: "And here is the body!",
    data: { someData: "goes here, maybe parking/camera data" },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}
