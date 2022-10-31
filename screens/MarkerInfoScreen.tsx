import { 
    Alert, Linking, SafeAreaView, ScrollView, View, Button, StyleSheet, Text 
} from 'react-native';
import { GOOGLE_MAPS_REDIRECT } from '../variables';
import { useCallback } from 'react';

const MarkerInfoScreen = ({ route }: any) => {
    const { parkingData } = route.params;
    
    // lat and lng, save for params (Google Maps URL).
    const { address, desc, name, spots, latitude, longitude } = parkingData;
    const parkingType = parkingData.public;

    const RedirectButton = (props: { link: string; }) => {
        const { link } = props;
        const handleRedirect = useCallback(
            async () => {
                const supported = await Linking.canOpenURL(link);
                if (!supported) {
                    Alert.alert(`Link ${link} invalid. Try again.`);
                    return;
                }
                await Linking.openURL(link);
            }, [link]
        )
        return (
            <View style={{ backgroundColor: '#49a429' }}>
                <Button
                    color={'white'}
                    title={'Go to Google Maps'}
                    onPress={handleRedirect}
                />
            </View>
        );
    };

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
    }
});

export default MarkerInfoScreen;
