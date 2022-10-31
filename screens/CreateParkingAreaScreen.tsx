import { useState, useEffect, useCallback } from 'react';
import { Text } from "../components/Themed";
import { StyleSheet, SafeAreaView, ScrollView, View, Button, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import FormData from "../components/form/FormData";
import FormTextField from "../components/form/FormTextField";
import FormToggleField from "../components/form/FormToggleField";
import * as Location from 'expo-location';

import Geocoder from 'react-native-geocoding';
import { GOOGLE_APIKEY, LOCAL_IPV4 } from '../variables';
/** look at ../api/axios to change URL settings in the future */

const CreateParkingAreaScreen = () => {
    const navigation = useNavigation();

    const [formValues, handleFormChange, setFormValues] = FormData({
        name: '', desc: '',
        address: '', spots: 0,
        latitude: 0, longitude: 0,
        public: '', hideFromMaps: false
    });

    const [usingCurrentLocation, setUsingCurrentLocation] = useState(false);
    const fetchCurrentLocation = useCallback(
        async () => {
            setUsingCurrentLocation(true);
            let loc = await Location.getCurrentPositionAsync({});
            let { latitude, longitude } = loc.coords;
            await setFormValues({
                ...formValues,
                latitude: latitude,
                longitude: longitude
            });

            let place = await Location.reverseGeocodeAsync(loc.coords);
            if (place[0] !== null) {
                const { streetNumber, street, city, region, postalCode } = place[0];
                const addrString = `${streetNumber} ${street}, ${city}, ${region} ${postalCode}`;
                await setFormValues({
                    ...formValues,
                    address: addrString
                });
            }
            else {
                Alert.alert("Cannot access current location. Try again.");
            }
        }, []
    );

    function validateEntries() {
        // i got lazy here
        const parkingTypes = ['Public', 'Private', 'Paid', 'public', 'private', 'paid', 'PUBLIC', 'PRIVATE', 'PAID'];
        
        const { address, name, spots } = formValues;
        if (!parkingTypes.includes(formValues.public)) return false;
        if (!usingCurrentLocation) return address.length > 0;
        return (
            name.length > 0 && spots > 0 && formValues.public.length > 0
        );
    }

    const [isCorrectAddr, setHasCorrectAddr] = useState(true);
    const [readAddress, setReadAddress] = useState('');
    useEffect(() => {
        const addressCheck = () => {
            Geocoder.init(GOOGLE_APIKEY);
            Geocoder.from(formValues.address)
                .then(({results}) => {
                    const latLng = results[0].geometry.location,
                        formattedAddr = results[0].formatted_address;
                    if (formValues.address.length > 0 && (latLng === undefined)) {
                        setHasCorrectAddr(false);
                        console.log("latLng is unavailable");
                    } else {
                        console.log(latLng.lat, latLng.lng);
                        setHasCorrectAddr(true);
                        setReadAddress(formattedAddr);
                        setFormValues({
                            ...formValues,
                            latitude: latLng.lat,
                            longitude: latLng.lng,
                            address: (formattedAddr !== formValues.address) ? formattedAddr : formValues.address 
                        });
                    }
                })
                .catch(err => console.error(err));
            return isCorrectAddr;
        };
        setTimeout(() => {
            const check = addressCheck();
            if (!check) {
                Alert.alert("Address is not recognizable");
                setFormValues({
                    ...formValues, address: ''
                });
                return;
            }
        }, 5000);
    }, [formValues.address]);

    const [isError, setIsError] = useState(false),
        [message, setMessage] = useState('');
    return (
        <SafeAreaView>
            <ScrollView bounces={false}>
                <Text style={{ 
                    fontStyle: 'italic', color: 'pink' 
                }}>Please note that selecting 'Use Current Location' will reset all other values. {'\n'}</Text>
                <View>
                    <View style={{
                        display: 'flex', flexDirection: 'row'
                    }}>
                        <FormTextField
                            label={'Parking Area Address'}
                            formKey='address'
                            placeholder="Enter address..."
                            handler={handleFormChange}
                        />
                        <TouchableOpacity 
                            style={styles.currentLocationContainer}
                            onPress={fetchCurrentLocation}
                        >
                            <Text style={{ fontSize: 16 }}>
                                Use Current {'\n'} Location
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={{ color: '#ffad00', fontStyle: "italic" }}>
                        Refrain from adding unit/apartment numbers. {'\n'}
                        <Text style={{ fontWeight: 'bold' }}>
                            Please double-check for correct address; input and detected address may not be the same.
                        </Text>
                    </Text>
                    <FormTextField
                        label='Parking Area Name'
                        formKey='name'
                        placeholder="Enter name..."
                        handler={handleFormChange}
                    />
                    <FormTextField 
                        label='Parking Area Description'
                        formKey='desc'
                        placeholder='Enter optional desription...'
                        handler={handleFormChange}
                    />
                    <FormTextField
                        label={'Number of Spots'}
                        formKey="spots"
                        placeholder="Enter number of spots in area..."
                        handler={handleFormChange}
                    />
                    <FormTextField
                        label={'Type of area (public, private, paid)'}
                        formKey="public"
                        placeholder={'Type in "Public", "Private", or "Paid"'}
                        handler={handleFormChange}
                    />
                    <FormToggleField
                        label={'Hide from Google Maps'}
                        formKey="hideFromMaps"
                        handler={handleFormChange}
                    />
                </View>
                <View style={styles.review}>
                    <Text style={styles.reviewTitle}>
                        Review All Information
                    </Text>
                    <Text>Address: {formValues.address}</Text>
                    <Text>Name: {formValues.name}</Text>
                    <Text style={{ padding: 1 }}>Description: {formValues.desc}</Text>
                    <Text>Number of spots: {formValues.spots}</Text>
                    <Text>Type of parking: {formValues.public}</Text>
                    <Text>
                        <Text style={{ fontWeight: 'bold' }}>Show on Google Maps:</Text> {String(formValues.hideFromMaps)}
                    </Text>
                </View>

                {/* confirm button */}

                <View style={styles.confirm}>
                    <Button
                        title={'Create Area'}
                        color={'white'}
                        onPress={() => {
                            if (!validateEntries()) {
                                Alert.alert("Not all fields are filled in or valid. Try again.");
                                return;
                            };

                            const payload = {
                                address: formValues.address,
                                latitude: formValues.latitude,
                                longitude: formValues.longitude,
                                name: formValues.name,
                                desc: formValues.desc,
                                spots: formValues.spots,
                                public: formValues.public,
                                hideFromMaps: formValues.hideFromMaps
                            };
                            /* fix this later :-(*/
                            fetch(`http://${LOCAL_IPV4}:3000/parkingarea/`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(payload)
                            })
                            .then(async (res) => {
                                try {
                                    res.json();
                                    setIsError(res.status !== 200);
                                    setMessage(res.statusText);
                                    Alert.alert("Created parking area!\nRefresh app to see parking info.");
                                    console.log(payload);
                                } catch (err) {
                                    Alert.alert(`Parking area was not made. \nError: ${isError}\nMessage: ${message}`);
                                    console.error(err);
                                }
                            })
                            .catch((err) => {
                                Alert.alert(`Parking area was not made. \nError: ${isError}\nMessage: ${message}`);
                                console.error(err);
                            });
                            setHasCorrectAddr(false);
                            navigation.navigate("Root");
                        }}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    confirm: {
        backgroundColor: "#49a429",
        borderRadius: 15,
        padding: '1.25%'
    },
    currentLocationContainer: {
        backgroundColor: "#49a429",
        borderRadius: 10,
        padding: 5,
        justifyContent: 'center',
        margin: '5%',
        marginTop: '10%'
    },
    review: {
        borderRadius: 10,
        backgroundColor: '#50008c',
        margin: '2.5%',
        padding: '2.5%'
    },
    reviewTitle: {
        fontWeight: 'bold',
        fontSize: 20
    }
});

export default CreateParkingAreaScreen;
