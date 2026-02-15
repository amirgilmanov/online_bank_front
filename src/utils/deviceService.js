export const getDeviceName = () => {
    const ua = navigator.userAgent;
    if (ua.includes("Windows")) return "Windows PC";
    if (ua.includes("iPhone")) return "iPhone";
    if (ua.includes("Android")) return "Android Device";
    if (ua.includes("Macintosh")) return "MacBook/iMac";
    return "Unknown Device";
};