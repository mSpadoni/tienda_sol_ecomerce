import DireccionEntrega from "../models/entities/DireccionEntrega.js";
import FaltaStock from "../errors/errorFaltaDeStock.js";
import logger from "../../logger/logger.js";
import findEstado from "../models/entities/EstadoPedido.js";
import ErrorEstadoNoValido from "../errors/errorEstadoNoValido.js";
import { obtenerMoneda } from "../models/entities/Moneda.js";
import ErrorMonedaNoPermitida from "../errors/errorMonedaNoPernitida.js";
import { TipoUsuario } from "../models/entities/TipoUsuario.js";
import axios from "axios";
import NoEsCompradorOVendedor from "../errors/errorDebeSerVendedorOComprador.js";
import dotenv from "dotenv";
dotenv.config(); // carga las variables de .env

const {
  KEYCLOAK_BASE_URL,
  REALM,
  ADMIN_USERNAME,
  ADMIN_PASSWORD,
  CLIENT_ID,
  CLIENT_SECRET,
  VENDEDOR_ID,
  COMPRADOR_ID,
} = process.env;

export function reducirStocks(items) {
  items.forEach((item) => item.producto.reducirStock(item.cantidad));
  return items;
}

export function aumentarStocks(items) {
  items.forEach((item) => item.producto.aumentarStock(item.cantidad));
  return items;
}

export function obtenerEstado(estado) {
  const estadoRequerido = findEstado(estado);
  if (!estadoRequerido) {
    throw new ErrorEstadoNoValido(estado);
  }
  return estadoRequerido;
}

export function monedaValida(monedaABuscar) {
  const moneda = obtenerMoneda(monedaABuscar);
  if (!moneda) {
    throw new ErrorMonedaNoPermitida(monedaABuscar);
  }
  return moneda;
}

export function validarStock(items) {
  if (!items.every((item) => item.estaDisponible())) {
    throw new FaltaStock();
  }
}

export function obtenerDireccion(pedido) {
  return new DireccionEntrega(
    pedido.direccionEntrega.calle,
    pedido.direccionEntrega.altura,
    pedido.direccionEntrega.piso,
    pedido.direccionEntrega.departamento,
    pedido.direccionEntrega.codigoPostal,
    pedido.direccionEntrega.ciudad,
    pedido.direccionEntrega.provincia,
    pedido.direccionEntrega.pais,
  );
}

// Función para obtener token de admin
const getAdminToken = async () => {
  const params = new URLSearchParams();
  params.append("grant_type", "password");
  params.append("client_id", CLIENT_ID);
  params.append("client_secret", CLIENT_SECRET); // <-- agregado
  params.append("username", ADMIN_USERNAME);
  params.append("password", ADMIN_PASSWORD);

  logger.info("obteniendo token");
  const response = await axios.post(
    `${KEYCLOAK_BASE_URL}/realms/${REALM}/protocol/openid-connect/token`,
    params,
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    },
  );
  logger.info("obteneido el token");
  return response.data.access_token;
};

const validarQueNoEsAdmin = (tipo) => {
  if (tipo !== TipoUsuario.COMPRADOR && tipo !== TipoUsuario.VENDEDOR) {
    throw new NoEsCompradorOVendedor();
  }
  return tipo;
};

export const createUser = async (userData) => {

  const token = await getAdminToken();

  const createResponse = await axios.post(
    `http://localhost:8080/admin/realms/${REALM}/users`,
    {
      username: userData.username,
      email: userData.email,
      firstName: userData.nombre,
      lastName: userData.apellido,
      enabled: true,
      credentials: [
        {
          type: "password",
          value: userData.password,
          temporary: false,
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );
  logger.info("usuario creado en keycloak correctamente");

  const locationHeader = createResponse.headers["location"];
  const userId = locationHeader.split("/").pop();

  logger.info(`user id obtenido: ${userId}`);

 

  await axios.post(
    `http://localhost:8080/admin/realms/${REALM}/users/${userId}/role-mappings/realm`,
    [
      {
        id: COMPRADOR_ID,
        name: "comprador",
      },
    ],
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  logger.info("asignacion del rol correcta");

  return userId;
};
