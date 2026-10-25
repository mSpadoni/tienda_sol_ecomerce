import fs from "fs";
import path from "path";
import mongoose from "mongoose";

const KEYCLOAK_BASE_URL = process.env.KEYCLOAK_BASE_URL || "http://keycloak:8080";
const KEYCLOAK_ADMIN = process.env.KEYCLOAK_ADMIN || "admin";
const KEYCLOAK_ADMIN_PASSWORD = process.env.KEYCLOAK_ADMIN_PASSWORD || "admin";
const REALM = process.env.KEYCLOAK_REALM || "ecommerce";
const BACKEND_CLIENT_ID = process.env.KEYCLOAK_BACKEND_CLIENT_ID || "backend-clente";
const LEGACY_BACKEND_CLIENT_ID = "backend_cliente";
const BACKEND_CLIENT_SECRET =
  process.env.KEYCLOAK_BACKEND_CLIENT_SECRET || "wWQA7vgOp4CujCmxJ3UdU9iLDE1NGwV7";
const FRONTEND_CLIENT_ID = process.env.KEYCLOAK_FRONTEND_CLIENT_ID || "tp_desarrollo";
const THEME_NAME = process.env.KEYCLOAK_THEME_NAME || "custom-theme";
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://mongo:27017/test";
const IMAGES_DIR =
  process.env.FRONTEND_IMAGES_PATH || "/app/packages/frontend/public/images";

const VENDEDOR_ROLE = {
  id: process.env.VENDEDOR_ROLE_ID || "d06e5f34-2638-4bf9-a096-a9b5fdfcba35",
  name: "vendedor",
};

const COMPRADOR_ROLE = {
  id: process.env.COMPRADOR_ROLE_ID || "b1a584a6-fc0f-4da9-a3a4-9bb92060af92",
  name: "comprador",
};

const VENDEDOR_USER = {
  username: process.env.VENDEDOR_USERNAME || "vendedor",
  email: process.env.VENDEDOR_EMAIL || "vendedor@tienda.com",
  firstName: "Vendedor",
  lastName: "Tienda Sol",
  password: process.env.VENDEDOR_PASSWORD || "Vendedor123!",
};

const usuarioSchema = new mongoose.Schema(
  {
    idKeycloak: { type: String, required: true, unique: true },
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    telefono: { type: String, required: true },
    tipo: { type: String, enum: ["comprador", "vendedor", "admin"], required: true },
    fechaAlta: { type: Date, required: true },
  },
  { timestamps: true, collection: "usuarios" },
);

const productoSchema = new mongoose.Schema(
  {
    vendedor: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
    titulo: { type: String, required: true },
    descripcion: { type: String, required: true },
    precio: { type: Number, required: true },
    categoria: { type: String, required: true },
    fotos: { type: String, required: true },
    stock: { type: Number, required: true },
    activo: { type: Boolean, required: true },
    moneda: { type: Object, required: true },
  },
  { timestamps: true, collection: "productos" },
);

const UsuarioModel = mongoose.models.Usuario || mongoose.model("Usuario", usuarioSchema);
const ProductoModel = mongoose.models.Producto || mongoose.model("Producto", productoSchema);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function toTitleFromFilename(fileName) {
  const withoutExt = fileName.replace(/\.[^.]+$/, "");
  return withoutExt
    .replace(/[_-]+/g, " ")
    .replace(/[+]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function inferCategoryFromFilename(fileName) {
  const normalized = fileName.toLowerCase();

  const sportsKeywords = [
    "mtb",
    "trail",
    "sport",
    "calza",
    "airmax",
    "cinta",
    "xbox",
    "deport",
  ];
  if (sportsKeywords.some((keyword) => normalized.includes(keyword))) {
    return "Deportes";
  }

  const clothingKeywords = [
    "adidas",
    "hoodie",
    "buzo",
    "pantalon",
    "remera",
    "rompeviento",
  ];
  if (clothingKeywords.some((keyword) => normalized.includes(keyword))) {
    return "Indumentaria";
  }

  return "Electrónica";
}

async function waitForKeycloakReady() {
  const maxWaitMs = Number(process.env.KEYCLOAK_WAIT_TIMEOUT_MS || 420000);
  const startedAt = Date.now();
  let attempt = 0;
  let lastStatus = "sin respuesta";

  while (Date.now() - startedAt < maxWaitMs) {
    attempt += 1;
    try {
      const healthResponse = await fetch(`${KEYCLOAK_BASE_URL}/health/ready`, {
        signal: AbortSignal.timeout(5000),
      });
      if (healthResponse.ok) {
        console.log("Keycloak listo (health/ready).");
        return;
      }
      lastStatus = `/health/ready -> ${healthResponse.status}`;
    } catch (error) {
      // Some images/configs do not expose health endpoint.
      lastStatus = "/health/ready no disponible";
    }

    try {
      const masterRealmResponse = await fetch(`${KEYCLOAK_BASE_URL}/realms/master`, {
        signal: AbortSignal.timeout(5000),
      });
      if (masterRealmResponse.ok) {
        const tokenResponse = await fetch(
          `${KEYCLOAK_BASE_URL}/realms/master/protocol/openid-connect/token`,
          {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              client_id: "admin-cli",
              username: KEYCLOAK_ADMIN,
              password: KEYCLOAK_ADMIN_PASSWORD,
              grant_type: "password",
            }),
            signal: AbortSignal.timeout(7000),
          },
        );

        if (tokenResponse.ok) {
          console.log("Keycloak listo (master realm + token endpoint).");
          return;
        }
        lastStatus = `/token -> ${tokenResponse.status}`;
      } else {
        lastStatus = `/realms/master -> ${masterRealmResponse.status}`;
      }
    } catch (error) {
      lastStatus = "/realms/master no disponible";
    }

    const elapsedSec = Math.floor((Date.now() - startedAt) / 1000);
    console.log(`Esperando Keycloak... intento ${attempt}, ${elapsedSec}s, estado: ${lastStatus}`);
    const backoffMs = Math.min(5000, 3000 + (attempt % 5) * 500);
    await sleep(backoffMs);
  }

  const waitedSec = Math.floor((Date.now() - startedAt) / 1000);
  throw new Error(
    `Keycloak no estuvo listo luego de ${waitedSec}s. Ultimo estado observado: ${lastStatus}`,
  );
}

async function waitForMongoReady() {
  for (let attempt = 1; attempt <= 30; attempt += 1) {
    try {
      await mongoose.connect(MONGODB_URI);
      console.log("MongoDB listo.");
      return;
    } catch (error) {
      console.log(`Esperando MongoDB... intento ${attempt}/30`);
      await sleep(3000);
    }
  }
  throw new Error("MongoDB no estuvo listo a tiempo.");
}

async function adminToken() {
  const response = await fetch(
    `${KEYCLOAK_BASE_URL}/realms/master/protocol/openid-connect/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: "admin-cli",
        username: KEYCLOAK_ADMIN,
        password: KEYCLOAK_ADMIN_PASSWORD,
        grant_type: "password",
      }),
    },
  );
  if (!response.ok) {
    throw new Error(`No se pudo autenticar en Keycloak (status ${response.status})`);
  }
  const data = await response.json();
  return data.access_token;
}

async function kcRequest(token, method, endpoint, body) {
  const response = await fetch(`${KEYCLOAK_BASE_URL}${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (![200, 201, 204, 409].includes(response.status)) {
    const text = await response.text();
    throw new Error(`Keycloak ${method} ${endpoint} -> ${response.status}: ${text}`);
  }

  return response;
}

async function kcGetJson(token, endpoint) {
  const response = await fetch(`${KEYCLOAK_BASE_URL}${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error(`Keycloak GET ${endpoint} -> ${response.status}`);
  }
  return response.json();
}

async function ensureRealm(token) {
  const realms = await kcGetJson(token, "/admin/realms");
  const exists = realms.some((realm) => realm.realm === REALM);
  if (!exists) {
    await kcRequest(token, "POST", "/admin/realms", {
      realm: REALM,
      enabled: true,
      loginTheme: THEME_NAME,
      displayName: "Ecommerce",
    });
    console.log(`Realm ${REALM} creado.`);
  } else {
    await kcRequest(token, "PUT", `/admin/realms/${REALM}`, {
      realm: REALM,
      enabled: true,
      loginTheme: THEME_NAME,
      adminTheme: "",
      accountTheme: "",
      emailTheme: "",
    });
    console.log(`Realm ${REALM} actualizado.`);
  }
}

async function ensureRealmRole(token, role) {
  await kcRequest(token, "POST", `/admin/realms/${REALM}/roles`, {
    id: role.id,
    name: role.name,
    description: `Rol ${role.name}`,
  });
  await kcRequest(token, "PUT", `/admin/realms/${REALM}/roles/${role.name}`, {
    name: role.name,
    description: `Rol ${role.name}`,
  });
  return await kcGetJson(token, `/admin/realms/${REALM}/roles/${role.name}`);
}

async function getClientByClientId(token, clientId) {
  const clients = await kcGetJson(
    token,
    `/admin/realms/${REALM}/clients?clientId=${encodeURIComponent(clientId)}`,
  );
  return clients[0] || null;
}

async function ensureClient(token, payload) {
  await kcRequest(token, "POST", `/admin/realms/${REALM}/clients`, payload);
  const client = await getClientByClientId(token, payload.clientId);
  if (!client) {
    throw new Error(`No se pudo leer el cliente ${payload.clientId}`);
  }
  await kcRequest(token, "PUT", `/admin/realms/${REALM}/clients/${client.id}`, payload);
  return await getClientByClientId(token, payload.clientId);
}

async function ensureBackendServiceAccountCanCreateUsers(token, backendClient) {
  const serviceUser = await kcGetJson(
    token,
    `/admin/realms/${REALM}/clients/${backendClient.id}/service-account-user`,
  );

  const realmMgmt = await getClientByClientId(token, "realm-management");
  if (!realmMgmt) {
    throw new Error("Cliente realm-management no encontrado.");
  }

  const manageUsersRole = await kcGetJson(
    token,
    `/admin/realms/${REALM}/clients/${realmMgmt.id}/roles/manage-users`,
  );
  const viewRealmRole = await kcGetJson(
    token,
    `/admin/realms/${REALM}/clients/${realmMgmt.id}/roles/view-realm`,
  );
  const manageRealmRole = await kcGetJson(
    token,
    `/admin/realms/${REALM}/clients/${realmMgmt.id}/roles/manage-realm`,
  );
  const viewUsersRole = await kcGetJson(
    token,
    `/admin/realms/${REALM}/clients/${realmMgmt.id}/roles/view-users`,
  );

  await kcRequest(
    token,
    "POST",
    `/admin/realms/${REALM}/users/${serviceUser.id}/role-mappings/clients/${realmMgmt.id}`,
    [
      { id: manageUsersRole.id, name: manageUsersRole.name },
      { id: viewRealmRole.id, name: viewRealmRole.name },
      { id: manageRealmRole.id, name: manageRealmRole.name },
      { id: viewUsersRole.id, name: viewUsersRole.name },
    ],
  );
}

async function ensureVendedorUser(token, vendedorRole) {
  await kcRequest(token, "POST", `/admin/realms/${REALM}/users`, {
    username: VENDEDOR_USER.username,
    email: VENDEDOR_USER.email,
    firstName: VENDEDOR_USER.firstName,
    lastName: VENDEDOR_USER.lastName,
    enabled: true,
    emailVerified: true,
    credentials: [
      {
        type: "password",
        value: VENDEDOR_USER.password,
        temporary: false,
      },
    ],
  });

  const users = await kcGetJson(
    token,
    `/admin/realms/${REALM}/users?username=${encodeURIComponent(VENDEDOR_USER.username)}`,
  );
  const user = users[0];
  if (!user) throw new Error("Usuario vendedor no encontrado luego del alta.");

  await kcRequest(
    token,
    "PUT",
    `/admin/realms/${REALM}/users/${user.id}/reset-password`,
    {
      type: "password",
      value: VENDEDOR_USER.password,
      temporary: false,
    },
  );

  await kcRequest(token, "POST", `/admin/realms/${REALM}/users/${user.id}/role-mappings/realm`, [
    {
      id: vendedorRole.id,
      name: vendedorRole.name,
    },
  ]);

  return user;
}

function listImageFiles() {
  if (!fs.existsSync(IMAGES_DIR)) {
    console.warn(`No existe la carpeta de imagenes: ${IMAGES_DIR}`);
    return [];
  }
  return fs
    .readdirSync(IMAGES_DIR)
    .filter((name) => /\.(png|jpe?g|webp|gif)$/i.test(name))
    .sort();
}

async function upsertMongoSeed(keycloakUserId) {
  const existingUser = await UsuarioModel.findOne({
    $or: [{ idKeycloak: keycloakUserId }, { keycloakId: keycloakUserId }],
  });

  let vendedorMongoId;
  if (existingUser) {
    existingUser.idKeycloak = keycloakUserId;
    existingUser.keycloakId = keycloakUserId;
    await existingUser.save();
    vendedorMongoId = existingUser._id;
    console.log(`Usuario Mongo existente: ${vendedorMongoId}`);
  } else {
    const created = await UsuarioModel.create({
      idKeycloak: keycloakUserId,
      keycloakId: keycloakUserId,
      nombre: "Vendedor Tienda Sol",
      email: VENDEDOR_USER.email,
      telefono: "+5491100000000",
      tipo: "vendedor",
      fechaAlta: new Date(),
    });
    vendedorMongoId = created._id;
    console.log(`Usuario Mongo creado: ${vendedorMongoId}`);
  }

  const imageFiles = listImageFiles();
  if (imageFiles.length === 0) {
    console.warn("No se encontraron imagenes para crear productos.");
    return;
  }

  // Normalize old records that stored "/images/<file>".
  const existingProducts = await ProductoModel.find({ vendedor: vendedorMongoId });
  for (const product of existingProducts) {
    const inferredCategory = inferCategoryFromFilename(product.fotos || "");
    let changed = false;

    if (typeof product.fotos === "string" && product.fotos.startsWith("/images/")) {
      product.fotos = product.fotos.replace(/^\/images\//, "");
      changed = true;
    }
    if (!product.categoria || product.categoria === "General") {
      product.categoria = inferredCategory;
      changed = true;
    }
    if (changed) {
      await product.save();
    }
  }

  let createdCount = 0;
  for (let i = 0; i < imageFiles.length; i += 1) {
    const image = imageFiles[i];
    const titulo = toTitleFromFilename(image);

    const existingProduct = await ProductoModel.findOne({
      vendedor: vendedorMongoId,
      $or: [{ fotos: image }, { fotos: `/images/${image}` }],
    });
    if (existingProduct) {
      if (existingProduct.fotos !== image) {
        existingProduct.fotos = image;
        await existingProduct.save();
      }
      continue;
    }

    await ProductoModel.create({
      vendedor: vendedorMongoId,
      titulo,
      descripcion: `Producto generado automaticamente desde la imagen ${image}.`,
      precio: 1000 + i * 100,
      categoria: inferCategoryFromFilename(image),
      fotos: image,
      stock: 20,
      activo: true,
      moneda: { codigo: "ARS", simbolo: "$", nombre: "Peso Argentino" },
    });
    createdCount += 1;
  }

  console.log(`Productos creados: ${createdCount} (total imagenes: ${imageFiles.length})`);
}

async function main() {
  await waitForKeycloakReady();
  const token = await adminToken();
  await ensureRealm(token);
  const vendedorRole = await ensureRealmRole(token, VENDEDOR_ROLE);
  await ensureRealmRole(token, COMPRADOR_ROLE);

  const backendClientIds = [...new Set([BACKEND_CLIENT_ID, LEGACY_BACKEND_CLIENT_ID])];
  for (const backendClientId of backendClientIds) {
    const backendClient = await ensureClient(token, {
      clientId: backendClientId,
      enabled: true,
      protocol: "openid-connect",
      publicClient: false,
      standardFlowEnabled: false,
      serviceAccountsEnabled: true,
      // Backend actual uses password grant in current code path.
      directAccessGrantsEnabled: true,
      secret: BACKEND_CLIENT_SECRET,
      webOrigins: ["http://localhost:3001"],
    });

    await ensureBackendServiceAccountCanCreateUsers(token, backendClient);
  }

  await ensureClient(token, {
    clientId: FRONTEND_CLIENT_ID,
    enabled: true,
    protocol: "openid-connect",
    publicClient: true,
    standardFlowEnabled: true,
    directAccessGrantsEnabled: true,
    redirectUris: ["http://localhost:3000/*"],
    webOrigins: ["http://localhost:3000/*"],
    rootUrl: "http://localhost:3000",
    baseUrl: "http://localhost:3000",
  });

  const vendedorUser = await ensureVendedorUser(token, vendedorRole);

  await waitForMongoReady();
  await upsertMongoSeed(vendedorUser.id);
  await mongoose.disconnect();
  console.log("Bootstrap Keycloak + MongoDB finalizado.");
}

main().catch(async (error) => {
  console.error(error);
  try {
    await mongoose.disconnect();
  } catch (_) {
    // ignore
  }
  process.exit(1);
});
