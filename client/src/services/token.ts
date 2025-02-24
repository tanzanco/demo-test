import Cookies from "js-cookie";


export const getToken = (): string | undefined => {
    const token = Cookies.get("authToken");
    if (!token) {
        return undefined;
    }
    return token;
}