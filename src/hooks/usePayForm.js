import {useState} from "react";

export const usePayForm = () => {
    const initialState = {
        senderInfo: {accountNumber: '', bankName: ''},
        serviceInfo: {serviceName: '', accountNumber: '', bankName: ''},
        serviceRequestAmount: '',
        category: 'RESTAURANT',
    };

    const [values, setValues] = useState(initialState);

    const handleChange = (section, field, value) => {
        if (section) {
            setValues(prev => ({
                ...prev,
                [section]: {...prev[section], [field]: value}
            }));
        } else {
            setValues(prev => ({...prev, [field]: value}));
        }
    };

    const reset = () => setValues(initialState);

    return {values, handleChange, reset};
};