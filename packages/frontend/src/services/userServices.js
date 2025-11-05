
import axios from 'axios';



export const crearUsuario = async (usuario) => {
  try{
    const response = await axios.post(`http://localhost:3001/usuario`,usuario);
    return response.data;
  } catch (error) {
    console.error(`Error al crear el usuario`, error);
    throw error;
  } 
}


