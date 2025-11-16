import { SiAxios } from "react-icons/si";
import productos from "../components/mockData/Productos.js";
import axios from "axios";
import procesarErrorAxios from "./errorsAdapter.js";
import { keyCloakToken } from "../provieder/keyCloak.jsx";
const API_BASE_URL = process.env.REACT_APP_API_URL;

export const getPedidos = async (page = 1, filtros = {}) => {
  try {
    const params = new URLSearchParams();
    params.append("page", page);

    const url = `${API_BASE_URL}/pedidos/hechos`;
    const response = await axios.get(url, {
    headers: {
    Authorization: `Bearer ${keyCloakToken}`
  }
    });
    return response.data;
  } catch (error) {
    console.error("Error obteniendo los productos:", error);
    throw procesarErrorAxios(error);
  }
};

export const crearPedido = async (pedidoData) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/pedidos`,
            pedidoData,
            {
                headers: {
                    Authorization: `Bearer ${keyCloakToken}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error creando el pedido:", error);
        throw procesarErrorAxios(error);
    }
};
export const getProductoById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/productos/${id}`, {
      headers: { "Cache-Control": "no-cache" },
    });
    return response.data;
  } catch (error) {
    console.error("Error obteniendo el producto:", error);
    throw procesarErrorAxios(error);
  }
};

export const getProductosSlowly = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(productos);
    }, 2000);
  });
