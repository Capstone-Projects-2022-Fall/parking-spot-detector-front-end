import { 
    Alert, Linking, SafeAreaView, ScrollView, View, Button, StyleSheet, Text 
} from 'react-native';
import { GOOGLE_MAPS_REDIRECT } from '../variables';
import { useCallback } from 'react';

const MarkerInfoScreen = ({}) => {
    /* destructure all props */

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
                    <Text>
                        TEST
                    </Text>
                </View>
                <RedirectButton 
                    link={GOOGLE_MAPS_REDIRECT}
                />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    mainTitle: {
        fontWeight: 'bold',
        fontSize: 100
    }
});

export default MarkerInfoScreen;
