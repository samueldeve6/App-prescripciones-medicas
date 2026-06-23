import {useAuthStore} from "@/store/authStore";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function fetcher(endpoint: string, options: RequestInit = {}) {
    const token = useAuthStore.getState().token;

    const headers = new Headers(options.headers);
    headers.set('Content-Type', 'application/json');

    if (token) {
        headers.set('Authorization',  `Bearer ${token}`);

    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,

    });

    //Si la respuesta es un PDF, retornamos el blob directamente
    if (response.headers.get('Content-Type')?.includes('application/pdf')) {
        return response.blob();
    }

    const data = await response.json();

    if (!response.ok){
        throw new Error(data.message || 'Ocurrio un error en la petición')
    }

    return data;
}