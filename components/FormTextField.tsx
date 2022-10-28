import { View, Text, StyleSheet, TextInput } from 'react-native';

const FormTextField = (props: any) => {
    const { label, placeholder, formKey, handler, textInputProps } = props;
    return (
        <View style={styles.formFieldWrapper}>
            <Text style={styles.labelText}>
                {label}
            </Text>
            <TextInput 
                placeholder={placeholder}
                placeholderTextColor={'lightgray'}
                style={styles.formFieldText}
                onChange={(event) => {
                    handler(formKey, event.nativeEvent.text)
                }}
                {...textInputProps}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    formFieldWrapper: {
    },
    formFieldText: {
        fontSize: 20,
        borderRadius: 15,
        borderWidth: 1,
        padding: 12,
        backgroundColor: 'white'
    },
    labelText: {
        fontSize: 20,
        marginBottom: 12,
        paddingLeft: 10,
        paddingTop: 10,
        color: 'purple',
        fontWeight: 'bold'
    }
});

export default FormTextField;
