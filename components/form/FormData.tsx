import { useState } from "react";

const FormData = (values: any) => {
    const [formValues, setFormValues] = useState({
        ...values
    });

    const handleFormChange = (k: any, v: any) => {
        setFormValues({
            ...formValues,
            [k]: v
        });
    };

    return [
        formValues,
        handleFormChange,
        setFormValues
    ]
};

export default FormData;
