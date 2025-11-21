import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;

export const getNotificaciones = async (filtros = {}, token) => {
  try {
    const url = `${API_BASE_URL}/notificaciones?${buildQuery(filtros)}`;

    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.get(url, { headers });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Error al obtener notificaciones');
    }
    throw error;
  }
};

function buildQuery(params) {
  const esc = encodeURIComponent;
  return Object.keys(params)
    .map(k => esc(k) + '=' + esc(params[k]))
    .join('&');
}

export const marcarNotificacionComoLeida = async (id, token) => {
  try {
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    const response = await axios.patch(`/notificaciones/${id}/lectura`, null, { headers });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default axios;