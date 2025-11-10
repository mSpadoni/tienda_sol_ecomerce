import axios from "axios";
import procesarErrorAxios from "./errorsAdapter.js";

// Función principal para obtener la tasa de conversión
export const obtenerTasa = async (base, target) => {
  try {
    const response = await axios.get(`http://localhost:3001/api/rates?base=${base.toLowerCase()}&target=${target.toLowerCase()}`);
    // Dependiendo de tu API, podría ser response.data.rate o response.data.rates[target]
    return response.data.rate || response.data.rates?.[target];
  } catch (error) {
    throw procesarErrorAxios(error);
  }
};
