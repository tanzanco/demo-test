import axios, { AxiosError } from 'axios';
import { getToken } from './token';

// const BASE_URL = 'http://localhost:3000/products';
const BASE_URL = `${process.env.NEXT_PUBLIC_API_ROUTE}/products`;
export interface Product {
    id: number;
    name: string;
    price: number;
    description?: string;
}

export interface CreateProductDTO {
    name: string;
    price: number;
    description?: string;
}

export interface UpdateProductDTO {
    name?: string;
    price?: number;
    description?: string;
}

const getErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        return error.response?.data?.message || error.message;
    }
    return error instanceof Error ? error.message : 'An unknown error occurred';
};

export const productService = {
    // Get all products
    getAll: async (): Promise<Product[]> => {
        try {
            const response = await axios.get<Product[]>(BASE_URL);
            return response.data;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    // Get single product by ID
    getById: async (id: number): Promise<Product> => {
        try {
            const response = await axios.get<Product>(`${BASE_URL}/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    // Create new product
    create: async (product: CreateProductDTO): Promise<Product> => {
        try {
            const token = getToken();
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const response = await axios.post<Product>(BASE_URL, product, { headers });
            return response.data;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    // Update product
    update: async (id: number, product: UpdateProductDTO): Promise<Product> => {
        try {
            const response = await axios.patch<Product>(`${BASE_URL}/${id}`, product);
            return response.data;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    // Delete product
    delete: async (id: number): Promise<void> => {
        try {
            const token = getToken();
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            await axios.delete(`${BASE_URL}/${id}`, { headers });
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    }
};