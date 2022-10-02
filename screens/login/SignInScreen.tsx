import { SafeAreaView, Button } from "react-native";
import { Text} from "../../components/Themed";
import { useNavigation } from "@react-navigation/native";

export default function LoginScreen() {
  const navigation = useNavigation();
  return (
    <SafeAreaView>
      <Text>Login</Text>
      <Button
        title="Click to login:"
        onPress={() => navigation.navigate("Root")}
      />
    </SafeAreaView>
  );
}


