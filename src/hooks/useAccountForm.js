import {useState} from "react";

export const useAccountForm = () => {
    const [currencyCode, setCurrencyCode] = useState("USD");
    // баланс
    const [accountNumber, setAccountNumber] = useState("");
    return{
        currencyCode,
        setCurrencyCode,
        accountNumber,
        setAccountNumber
    };
};