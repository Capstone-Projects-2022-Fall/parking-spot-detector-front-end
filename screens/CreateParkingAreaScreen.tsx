import { useState, useEffect, useCallback } from 'react';
import { Text } from "../components/Themed";
import { StyleSheet, SafeAreaView, ScrollView, View, Button, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import FormData from "../components/FormData";
import FormTextField from "../components/FormTextField";
import FormToggleField from "../components/FormToggleField";
import * as Location from 'expo-location';

import Geocoder from 'react-native-geocoding';
import { GOOGLE_APIKEY } from '../variables';
import axios from '../api/axios';

const CreateParkingAreaScreen = () => {
    const navigation = useNavigation();

    const [formValues, handleFormChange, setFormValues] = FormData({
        name: '',
        desc: '',
        address: '',
        spots: 0,
        public: '',
        hideFromMaps: false
    });

    const fetchCurrentLocation = useCallback(
        async () => {
            let loc = await Location.getCurrentPositionAsync({});
            let place = await Location.reverseGeocodeAsync(loc.coords);
            if (place[0] !== null) {
                const { streetNumber, street, city, region, postalCode } = place[0];
                const addrString = `${streetNumber} ${street}, ${city}, ${region} ${postalCode}`;
                setFormValues({
                    ...formValues,
                    address: addrString
                });
            }
            else {
                Alert.alert("Cannot access current location. Try again.");
                return;
            }
        }, []
    );

    function validateEntries() {
        if (formValues.address.length <= 0) return false;
        if (formValues.name.length <= 0) return false;
        if (formValues.spots <= 0) return false;
        if (formValues.public.length <= 0) return false;
        if (formValues.hideFromMaps.length <= 0) return false;
        return true;
    }

    const [isCorrectAddr, setHasCorrectAddr] = useState(false);
    useEffect(() => {
        if (formValues.address.length > 0) {
            const addressCheck = () => {
                Geocoder.init(GOOGLE_APIKEY);
                Geocoder.from(formValues.address)
                    .then((res) => {
                        setHasCorrectAddr(true);
                    })
                    .catch(err => console.error(err));
                console.log(isCorrectAddr);
                return isCorrectAddr;
            };
            setTimeout(() => {
                if (!!!addressCheck) {
                    Alert.alert("Address is not recognizable");
                    setFormValues({
                        ...formValues,
                        address: ''
                    });
                    return;
                }
            }, 3000);
        }
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
                    <Text style={{
                            color: '#ffad00', fontStyle: "italic"
                        }}
                        >
                            Refrain from adding unit/apartment numbers. {'\n'}
                        </Text>
                    <FormTextField
                        label='Parking Area Name'
                        formKey='name'
                        placeholder="Enter name..."
                        handler={handleFormChange}
                    />
                    <FormTextField 
                        label='Parking Area Description'
                        formKey='description'
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
                            const ve = validateEntries();
                            if (!ve) {
                                Alert.alert("Not all fields are filled in or valid. Try again.");
                                return;
                            };

                            /* connect to backend */
                            const payload = {
                                address: formValues.address,
                                name: formValues.name,
                                desc: formValues.desc,
                                spots: formValues.spots,
                                public: formValues.public,
                                hideFromMaps: formValues.hideFromMaps
                            };
                            /* change IP address each time if running on a local machine */
                            axios.post("http://192.168.1.153:3000/parkingarea/", payload, {
                                headers: { 'Content-Type': 'application/json' }
                            })
                            .then(async (res) => {
                                try {
                                    const data = await res.data;
                                    setIsError((res.status !== 200) ? true : false);
                                    setMessage(data.message);
                                    Alert.alert("Created parking area!");
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
