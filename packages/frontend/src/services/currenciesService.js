import axios from "axios";
import procesarErrorAxios from "./errorsAdapter.js";

export const obtenerTasa = async (base, target) => {
  try {
    const response = await axios.get(
      `http://localhost:3001/api/rates?base=${base.toLowerCase()}&target=${target.toLowerCase()}`,
    );

    return response.data.rate || response.data.rates?.[target];
  } catch (error) {
    throw procesarErrorAxios(error);
  }
};
