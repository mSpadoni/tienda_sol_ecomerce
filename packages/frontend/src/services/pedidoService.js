import { SiAxios } from "react-icons/si";
import productos from "../components/mockData/Productos.js";
import axios from "axios";
import procesarErrorAxios from "./errorsAdapter.js";
import { keyCloakToken } from "../provieder/keyCloak.jsx";
import {getProductoById} from "../services/ProductosService.js"
const API_BASE_URL = process.env.REACT_APP_API_URL;


export const getPedidos = async (pathBackend) => {
  try {
    const url = `${API_BASE_URL}` + pathBackend;

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


export const cambiarEstado = async (Idpedido,estado,motivo) => {
      try {
        const response = await axios.patch(
            `${API_BASE_URL}/pedidos/` + Idpedido,
            {
              "estado": estado,
              "motivo": motivo
            },
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
}