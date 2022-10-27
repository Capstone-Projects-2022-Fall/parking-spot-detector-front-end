import { useState, useEffect } from 'react';
import MapView from 'react-native-maps';
import { StyleSheet, View, Dimensions } from 'react-native';
import * as Location from 'expo-location';
import Geocoder from 'react-native-geocoding';
import { GOOGLE_APIKEY } from '../variables';

interface MapLocation {
    latitude: number,
    longitude: number,
    latitudeDelta: number,
    longitudeDelta: number
}

export default function ParkingMapView() {
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
        <View style={styles.container}>
            <MapView 
                style={styles.map}
                provider={'google'}
                showsUserLocation={true}
                region={region}
                loadingEnabled
            />
        </View>
    );
}

/* dimensions and styles for map view */
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
        height: Dimensions.get("window").height
    }
});

/* style components within Google Maps*/ 
const mapStyles = [];