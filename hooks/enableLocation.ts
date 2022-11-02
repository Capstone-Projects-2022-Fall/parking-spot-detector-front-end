import * as Location from 'expo-location';
import { useState } from 'react';

export function enableLocation() {
    const [location, setLocation] = useState<Location.LocationObject | null>(null)

    const changeLocation = async () => {
        var loc = await Location.getCurrentPositionAsync({});
        setLocation(loc);
    };

    return [location, setLocation, changeLocation];
}