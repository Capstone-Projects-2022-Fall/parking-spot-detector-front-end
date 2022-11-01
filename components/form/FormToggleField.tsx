import { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';

const FormToggleField = (props: any) => {
    const { label, formKey, handler } = props;
    const [on, setOn] = useState<boolean>(true);
    return (
        <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Text style={styles.title}>
                {label}
            </Text>
            <View style={styles.container}>
                <Switch
                    value={on}
                    onValueChange={(switchValue) => {
                        setOn(switchValue);
                        handler(formKey, on);
                    }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        marginBottom: 15,
        marginTop: 8,
        paddingLeft: 10,
        paddingTop: 10,
        color: "#ffad00",
        fontWeight: 'bold'
    },
    container: {
        padding: 12,
        paddingLeft: 20
    }
});

export default FormToggleField;
