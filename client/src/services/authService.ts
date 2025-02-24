// services/authService.ts
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

// const BASE_URL = "http://localhost:3000/auth";
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

// Helper function to extract error messages
const getErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        return error.response?.data?.message || error.message;
    }
    return error instanceof Error ? error.message : "An unknown error occurred";
};

export const authService = {
    // User Registration
    register: async (data: AuthDTO): Promise<AuthResponse> => {
        try {
            const response = await axios.post<AuthResponse>(`${BASE_URL}/register`, data);
            Cookies.set("authToken", response.data.token, { expires: 1 }); // Token valid for 7 days
            return response.data;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    // User Login
    login: async (data: loginDTO): Promise<AuthResponse> => {
        try {
            const response = await axios.post<AuthResponse>(`${BASE_URL}/login`, data);
            Cookies.set("authToken", response.data.token, { expires: 1 });
            return response.data;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    // User Logout
    logout: (): void => {
        Cookies.remove("authToken"); // Clear the token from cookies
    },

    // Get the stored auth token
    getToken: (): string | undefined => {
        return Cookies.get("authToken");
    },

    // Check if the user is authenticated
    isAuthenticated: (): boolean => {
        return !!Cookies.get("authToken");
    },
};
