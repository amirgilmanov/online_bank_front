import { useState } from "react";

export const useAuthForms = () => {
    const [verifyForm, setVerifyForm] = useState({
        email: "", code: "", deviceName: "", userAgent: navigator.userAgent,
    });

    const [loginForm, setLoginForm] = useState({
        email: "", password: "", deviceId: "", deviceName: "", userAgent: navigator.userAgent,
    });

    const handleVerifyChange = (e) => {
        setVerifyForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleLoginChange = (e) => {
        setLoginForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return { verifyForm, handleVerifyChange, loginForm, handleLoginChange };
};