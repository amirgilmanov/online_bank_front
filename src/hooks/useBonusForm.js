import {useState} from "react";

export const useBonusForm = () => {
    const [form, setForm] = useState({
        accountNumber: "",
        points: "",
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setForm(prev => ({...prev, [name]: value}));
    };

    return {form, handleChange};
};