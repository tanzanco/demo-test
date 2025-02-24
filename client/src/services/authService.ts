import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_ROUTE}/auth`;

export interface AuthResponse {
    token: string;
}

export interface AuthDTO {
    username: string;
    email: string;
    password: string;
}
export interface loginDTO {
    email: string;
    password: string;
}


const getErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        return error.response?.data?.message || error.message;
    }
    return error instanceof Error ? error.message : "An unknown error occurred";
};

export const authService = {
    //  Registration
    register: async (data: AuthDTO): Promise<AuthResponse> => {
        try {
            const response = await axios.post<AuthResponse>(`${BASE_URL}/register`, data);
            Cookies.set("authToken", response.data.token, { expires: 1 });
            return response.data;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    //  Login
    login: async (data: loginDTO): Promise<AuthResponse> => {
        try {
            const response = await axios.post<AuthResponse>(`${BASE_URL}/login`, data);
            Cookies.set("authToken", response.data.token, { expires: 1 });
            return response.data;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    // logout
    logout: (): void => {
        Cookies.remove("authToken"); // Clear the token from cookies
    },

    //not using this function
    getToken: (): string | undefined => {
        return Cookies.get("authToken");
    },

    //not using this function
    isAuthenticated: (): boolean => {
        return !!Cookies.get("authToken");
    },
};
