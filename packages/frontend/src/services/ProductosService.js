import { SiAxios } from "react-icons/si";
import productos from "../components/mockData/Productos.js";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL

export const getProductos = async (page = 1, filtros = {}) => {
    try{
        const params = new URLSearchParams();
        params.append('page', page);

        Object.entries(filtros || {}).forEach(([key, value]) => {
            if (value === undefined || value === null) return;
            if (typeof value === 'string' && value.trim() === '') return;
            if (typeof value === 'boolean') {
                params.append(key, value ? 'true' : 'false');
            } else {
                params.append(key, String(value));
            }
        });
           
        const url = `${API_BASE_URL}/productos?${params.toString()}`;
        const response = await axios.get(url, {headers: {'Cache-Control': 'no-cache'}});
        return response.data;

    } catch (error) {
        console.error("Error obteniendo los productos:", error);
        throw error;
    }
}

export const getProductoById = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/productos/${id}`, { headers: { 'Cache-Control': 'no-cache' } });
        return response.data;
        
    } catch (error) {
        console.error("Error obteniendo el producto:", error);
        throw error;
    }
};

export const getProductosSlowly = () =>
    new Promise((resolve) => {
        setTimeout(() => {
            resolve(productos);
        }, 2000);
    });