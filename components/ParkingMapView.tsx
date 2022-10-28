import { useState, useEffect } from 'react';
import MapView from 'react-native-maps';
import { StyleSheet, View, Dimensions, Button, Alert } from 'react-native';
import * as Location from 'expo-location';
import Geocoder from 'react-native-geocoding';
import { GOOGLE_APIKEY } from '../variables';

interface MapLocation {
    latitude: number,
    longitude: number,
    latitudeDelta: number,
    longitudeDelta: number
}

const Separator = () => {
    return (
        <View style={styles.sep} />
    );
};

const ParkingMapView = () => {
    const ZOOM = 0.25;
    const [currLocation, setCurrLocation] = useState<Location.LocationObject | null>(null);

    useEffect(() => {
        (async () => {
            var location = await Location.getCurrentPositionAsync({});
            setCurrLocation(location);
        })();
    }, []);

    const lat = (currLocation !== null) ? currLocation.coords.latitude : 0.00,
        lng = (currLocation !== null) ? currLocation?.coords.longitude : 0.00;
    const region: MapLocation = {
        latitude: lat,
        longitude: lng,
        latitudeDelta: ZOOM,
        longitudeDelta: ZOOM
    }

    Geocoder.init(GOOGLE_APIKEY);
    return (
        <>
            <View style={styles.container}>
                <MapView 
                    style={styles.map}
                    provider={'google'}
                    showsUserLocation={true}
                    region={region}
                    loadingEnabled
                />
            </View>
            <Separator />
            <Button
                onPress={() => Alert.alert("Redirect to google maps")}
                title={'Go to Google Maps'} 
                color={'#49a429'}
            />
        </>
    );
}

/* dimensions and styles for map view */
const TUNE = 0.5;
const styles = StyleSheet.create({
    container: {
        position: 'relative',
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    map: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height * TUNE,
    },
    testButton: {
        padding: '1em',
        height: '50%'
    },
    sep: {
        marginVertical: 8,
        borderBottomColor: '#777',
        borderBottomWidth: StyleSheet.hairlineWidth,
    }
});

/* style components within Google Maps*/ 
const mapStyles = [];

export default ParkingMapView;
