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
                onEndEditing={(event) => {
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
        fontSize: 15,
        borderRadius: 12.5,
        borderWidth: 0.5,
        padding: 10,
        backgroundColor: 'white'
    },
    labelText: {
        fontSize: 18,
        marginBottom: 15,
        marginTop: 8,
        paddingLeft: 10,
        paddingTop: 10,
        color: '#ffad00',
        fontWeight: 'bold'
    }
});

export default FormTextField;
