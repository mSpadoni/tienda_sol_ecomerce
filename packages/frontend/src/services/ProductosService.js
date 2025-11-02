import { SiAxios } from "react-icons/si";
import productos from "../components/mockData/Productos.js";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL

export const getProductos = async (page) => {
    try{
        
        const response = await axios.get(`${API_BASE_URL}/productos?page=${page}`, {headers: {'Cache-Control': 'no-cache'}});
        return response.data;
    } catch (error) {
        console.error("Error obteniendo los productos:", error);
        throw error;
    }
}

export const getProductosSlowly = () =>
    new Promise((resolve) => {
        setTimeout(() => {
            resolve(productos);
        }, 2000);
    });