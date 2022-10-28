import { Text } from "../components/Themed";
import { StyleSheet, View, Button, Alert } from 'react-native';
import { useNavigation } from "@react-navigation/native";

const CreateParkingArea = () => {
    const navigation = useNavigation();
    
    return (
        <View>
            <Text>Create Parking Area</Text>
            <View style={styles.confirm}>
                <Button
                    title={'Create Area'}
                    color={'white'}
                    onPress={() => {
                        Alert.alert("Created parking area!");
                        navigation.navigate("Root");
                    }}
                />
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    confirm: {
        backgroundColor: "#49a429",
        borderRadius: 15,
        padding: '1.25%'
    }
});

export default CreateParkingArea;
