import axios from "axios";
import procesarErrorAxios from "./errorsAdapter.js";

export const crearUsuario = async (usuario) => {
  try {
    const base = process.env.REACT_APP_API_URL || "http://localhost:3001";
    const response = await axios.post(`${base}/usuario`, usuario);
    return response.data;
  } catch (error) {
    throw procesarErrorAxios(error);
  }
};
