import { useState, useEffect, useCallback } from 'react';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions, Button, Linking, Alert } from 'react-native';
import * as Location from 'expo-location';
import Geocoder from 'react-native-geocoding';
import { GOOGLE_APIKEY, LOCAL_IPV4 } from '../variables';
import { useNavigation } from "@react-navigation/native";
import axios from 'axios';

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

const RedirectButton = (props: { link: string; }) => {
    const { link } = props;
    const handleRedirect = useCallback(
        async () => {
            const supported = await Linking.canOpenURL(link);
            if (!!!supported) {
                Alert.alert(`Link ${link} invalid. Try again.`);
                return;
            } 
            await Linking.openURL(link);
        }, [link]
    )
    return (
        <View style={styles.redirect}>
            <Button
                color={'white'}
                title={'Go to Google Maps'}
                onPress={handleRedirect}
            />
        </View>
    );
};

const ParkingMapView = () => {
    const navigation = useNavigation();
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

    const [markers, setMarkers] = useState([]);
    const MARKER_OPACITY = 0.875, 
        MARKER_HIDE_HUE = '#ffad00',
        MARKER_NORMAL_HUE = '#49a429';
    useEffect(() => {
        axios.get(`http://${LOCAL_IPV4}:3000/parkingarea/`)
            .then(async (res) => {
                const data = res.data;
                const newMarkers = data.map((item: any, index: any) => {
                    const { name, desc, hideFromMaps, address, latitude, longitude, spots } = item,
                        aBreak = address.indexOf(",");
                    return (
                        <Marker
                            key={index}
                            coordinate={{
                                latitude: latitude,
                                longitude: longitude
                            }} 
                            title={name}
                            description={desc}
                            opacity={MARKER_OPACITY}
                            pinColor={(hideFromMaps) ? MARKER_HIDE_HUE : MARKER_NORMAL_HUE}
                        >
                            <Callout>
                                <View>
                                    <Text>
                                        <Text style={{fontWeight:'bold'}}>Address:</Text> {address.substring(0, aBreak) + '\n' + address.substring(aBreak+2)}
                                    </Text>
                                    <Text>
                                        <Text style={{fontWeight:'bold'}}>Type of space:</Text> {item.public}
                                    </Text>
                                    <Text>
                                        <Text style={{fontWeight:'bold'}}>Number of spots:</Text> {spots}
                                    </Text>
                                </View>
                            </Callout>
                        </Marker>
                    )
                });
                setMarkers(newMarkers);
            })
            .catch((err) => console.error(err));
    }, []);

    const GOOGLE_MAPS_REDIRECT_URL = "https://maps.google.com";
    Geocoder.init(GOOGLE_APIKEY);
    
    return (
        <>
            <View style={styles.container}>
                <MapView 
                    style={styles.map}
                    provider={PROVIDER_GOOGLE}
                    showsUserLocation={true}
                    region={region}
                    loadingEnabled
                    customMapStyle={mapStyles}
                >
                    {
                        markers
                    }
                </MapView>
            </View>
            <Separator />
            <View style={styles.createArea}>
                <Button 
                    color={'white'}
                    title={'Create Parking Area'}
                    onPress={() => {
                        navigation.navigate("CreateParkingAreaScreen");
                    }}
                />
            </View>
            <Separator />
            <RedirectButton 
                link={GOOGLE_MAPS_REDIRECT_URL}
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
    sep: {
        marginVertical: 8,
        borderBottomColor: '#777',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    redirect: {
        backgroundColor: '#49a429',
        padding: '1.25%',
        borderRadius: 15,
        width: '90%',
        marginLeft: '2.5%'
    },
    createArea: {
        backgroundColor: "#8a00c2",
        padding: '1.25%',
        borderRadius: 15,
        width: '90%',
        marginLeft: '2.5%',
    }
});

/* style components within Google Maps*/ 
const mapStyles = [
    {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [
            { color: "#8a00c2" }
        ]
    },
    {
        featureType: 'road',
        elementType: "geometry.fill",
        stylers: [
            { color: '#e8bcf0' }
        ]
    },
    {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [
            { color: "#8a00c2" }
        ]
    },
    {
        featureType: 'administrative.neighborhood',
        elementType: 'labels.text.fill',
        stylers: [
            { color: "#241571" }
        ]
    },
];
// More info on styling Maps: https://developers.google.com/maps/documentation/javascript/style-reference

export default ParkingMapView;
