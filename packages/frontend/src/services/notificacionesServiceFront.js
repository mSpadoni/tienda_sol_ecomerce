import axios from 'axios';
import procesarErrorAxios from "./errorsAdapter.js";

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

export const getNotificaciones = async (filtros = {}, token) => {
  try {
    const query = buildQuery(filtros);
    const url = `${API_BASE_URL}/notificaciones${query ? `?${query}` : ''}`;

    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.get(url, { headers });
    return response.data;
  } catch (error) {
    throw procesarErrorAxios(error);
  }
};


function buildQuery(params) {
  const keys = Object.keys(params || {});
  if (keys.length === 0) return '';
  const esc = encodeURIComponent;
  return keys
    .map((k) => esc(k) + '=' + esc(String(params[k])))
    .join('&');
}

export const marcarNotificacionComoLeida = async (id, token) => {
  try {
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    const url = `${API_BASE_URL}/notificaciones/${id}/lectura`;
    const response = await axios.patch(url, null, { headers });
    return response.data;
  } catch (error) {
    throw procesarErrorAxios(error);
  }
};

export default axios;