import axios from "axios";
import procesarErrorAxios from "./errorsAdapter.js";

export const crearUsuario = async (usuario) => {
  try {
    const response = await axios.post(`http://localhost:3001/usuario`, usuario);
    return response.data;
  } catch (error) {
    throw procesarErrorAxios(error);
  }
};
