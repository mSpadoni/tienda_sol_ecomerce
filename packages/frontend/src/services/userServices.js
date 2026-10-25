import axios from "axios";
import procesarErrorAxios from "./errorsAdapter.js";
import { API_BASE_URL } from "./apiConfig.js";

export const crearUsuario = async (usuario) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/usuario`, usuario);
    return response.data;
  } catch (error) {
    throw procesarErrorAxios(error);
  }
};
