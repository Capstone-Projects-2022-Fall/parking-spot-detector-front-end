import { 
    Alert, Linking, SafeAreaView, ScrollView, View, Button, StyleSheet, Text 
} from 'react-native';
import { GOOGLE_MAPS_REDIRECT, WEBSITE } from '../variables';
import { useCallback } from 'react';

const MarkerInfoScreen = ({ route, navigation }: any) => {
    const { parkingData } = route.params;
    
    // lat and lng, save for params (Google Maps URL).
    const { address, desc, name, spots } = parkingData;
    const parkingType = parkingData.public;

    // for button to start driving
    const RedirectButton = (props: { link: string }) => {
        const { link } = props;
        
        // before redirecting, set params to URL
        // NOTE: My+Location works only if you're Maps is in English.
        let paramAddr = address.split(/[, ]+/);
        paramAddr = paramAddr.join("+");
        const gotoLink = link + `?saddr=My+Location&daddr=${paramAddr}`;

        const handleRedirect = useCallback(
            async () => {
                const supported = await Linking.canOpenURL(link);
                if (!supported) {
                    Alert.alert(`Link ${gotoLink} invalid. Try again.`);
                    return;
                }
                await Linking.openURL(gotoLink);
            }, [link]
        )
        return (
            <View style={{ backgroundColor: '#49a429' }}>
                <Button
                    color={'white'}
                    title={'Start Driving'}
                    onPress={handleRedirect}
                />
            </View>
        );
    };

    // for deleting parking area
    /*const deleteArea = () => {
        let delData = String(parkingData._id);
        fetch(`http://${WEBSITE}/parkingarea/${delData}`)
            .then((res) => {
                Alert.alert("Parking area has been deleted! Refresh to see changes.");
                console.log(res.json());
                navigation.goBack();
            })
            .catch(err => console.error(err));
    }*/

    // main screen view
    return (
        <SafeAreaView>
            <ScrollView bounces={false}>
                <View>
                    <Text style={styles.mainTitle}>
                        {name}
                    </Text>
                    <Text style={styles.subTitle}>
                        {address}
                    </Text>
                </View>
                <RedirectButton 
                    link={GOOGLE_MAPS_REDIRECT}
                />
                <View style={styles.info}>
                    <Text style={styles.t}>
                        {parkingType + '\n'}
                    </Text>
                    {
                        desc.length > 0 &&
                        <Text style={styles.t}>
                            {desc + '\n'}
                        </Text>
                    }
                    <Text style={styles.t}>
                        Spots: {spots}
                    </Text>
                </View>
                {
                    /*<View style={styles.delete}>
                        <Button
                            title={'Delete Parking Area'}
                            color="white"
                            onPress={deleteArea} 
                        />
                    </View>*/
                }
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    mainTitle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 32,
        margin: 20
    },
    subTitle: {
        color: 'white',
        fontSize: 15,
        marginLeft: 20
    },
    info: {
        backgroundColor: '#301973',
        margin: 5,
        padding: 6,
    },
    t: {
        color: 'white'
    },
    delete: {
        backgroundColor: 'red',
        borderRadius: 10,
        padding: 6
    }
});

export default MarkerInfoScreen;
