import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { UsuarioModel } from "../schemas/UsuarioSchema.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Schema de productos (mantener local ya que no está en schemas)
const productoSchema = new mongoose.Schema(
  {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
    },
    vendedor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    titulo: {
      type: String,
      required: true,
    },
    descripcion: {
      type: String,
      required: true,
    },
    precio: {
      type: Number,
      required: true,
    },
    categoria: {
      type: String,
      required: true,
    },
    fotos: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    activo: {
      type: Boolean,
      required: true,
    },
    moneda: {
      type: Object,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "productos",
  }
);

const ProductoModel = mongoose.model("Producto", productoSchema);

// Mapeo de productos con información
const productosInfo = {
  "51fM0CKG+HL._SL1500_.jpg": {
    titulo: "Monitor Samsung 4K 55 Pulgadas",
    descripcion: "Monitor Samsung 4K de 55 pulgadas con tecnología HDR y color ultra nítido",
    precio: 15999,
    categoria: "Monitores",
    stock: 5,
  },
  "6d70946c4c19c96dfc1e76af8668.jpg": {
    titulo: "Laptop Gamer MSI RTX 4070",
    descripcion: "Laptop gamer MSI con RTX 4070, procesador i7 y pantalla 165Hz",
    precio: 89999,
    categoria: "Computadoras",
    stock: 3,
  },
  "adidas_rompeviento.jpg": {
    titulo: "Rompevientos Adidas",
    descripcion: "Rompevientos deportivo Adidas de alta calidad y comodidad",
    precio: 4999,
    categoria: "Ropa",
    stock: 20,
  },
  "audifonos_x100.jpeg": {
    titulo: "Audífonos X100 Pro",
    descripcion: "Audífonos inalámbricos con cancelación de ruido activa y sonido envolvente",
    precio: 12999,
    categoria: "Audio",
    stock: 15,
  },
  "audifonos_x100.jpg": {
    titulo: "Audífonos X100 Pro",
    descripcion: "Audífonos inalámbricos con cancelación de ruido activa y sonido envolvente",
    precio: 12999,
    categoria: "Audio",
    stock: 15,
  },
  "auris_basicos.jpg": {
    titulo: "Auriculares Básicos",
    descripcion: "Auriculares básicos con conexión jack 3.5mm y micrófono integrado",
    precio: 1499,
    categoria: "Audio",
    stock: 30,
  },
  "buzo-negro.jpg": {
    titulo: "Buzo Negro Deportivo",
    descripcion: "Buzo negro deportivo de algodón 100% con logo bordado",
    precio: 5499,
    categoria: "Ropa",
    stock: 25,
  },
  "Calza-deportiva-para-mujer-SWAN-370x444.jpg": {
    titulo: "Calza Deportiva para Mujer SWAN",
    descripcion: "Calza deportiva de compresión para mujer con tecnología anti-transpiración",
    precio: 3999,
    categoria: "Ropa",
    stock: 18,
  },
  "cinta_pro3000.jpg": {
    titulo: "Cinta de Correr Pro 3000",
    descripcion: "Cinta de correr profesional con velocidad máxima de 25 km/h y pantalla LCD",
    precio: 34999,
    categoria: "Deportes",
    stock: 2,
  },
  "D_NQ_944137-MLA70392857420_072023-OO.jpg": {
    titulo: "Cable HDMI 2.1 de 3 metros",
    descripcion: "Cable HDMI 2.1 de alta velocidad compatible con 8K a 120Hz",
    precio: 2499,
    categoria: "Cables",
    stock: 50,
  },
  "hoodie_unisex.jpeg": {
    titulo: "Hoodie Unisex Grafiti",
    descripcion: "Hoodie de moda unisex con estampa de grafiti y bolsillos kangaroo",
    precio: 6999,
    categoria: "Ropa",
    stock: 22,
  },
  "hyperx_flight.jpg": {
    titulo: "HyperX Cloud Flight Inalámbrico",
    descripcion: "Audífonos HyperX con conexión inalámbrica 2.4GHz y batería de 30 horas",
    precio: 19999,
    categoria: "Audio",
    stock: 8,
  },
  "logitech_g203.jpg": {
    titulo: "Logitech G203 RGB Gamer",
    descripcion: "Mouse gaming Logitech G203 con sensor PMW3519 y RGB personalizable",
    precio: 3499,
    categoria: "Periféricos",
    stock: 40,
  },
  "minicam.jpg": {
    titulo: "Minicámara 4K Full HD",
    descripcion: "Minicámara de acción 4K con sensor estabilizador y batería de 12 horas",
    precio: 8999,
    categoria: "Cámaras",
    stock: 10,
  },
  "mouse_gamer.jpg": {
    titulo: "Mouse Gamer Ergonómico",
    descripcion: "Mouse gamer ergonómico con 7 botones programables y sensor óptico 3200 DPI",
    precio: 5999,
    categoria: "Periféricos",
    stock: 35,
  },
  "msi_27_144hz.png": {
    titulo: "Monitor MSI 27 Pulgadas 144Hz",
    descripcion: "Monitor gamer MSI 27 pulgadas 1440p con tasa de refresco de 144Hz",
    precio: 28999,
    categoria: "Monitores",
    stock: 6,
  },
  "mtb_trail.jpg": {
    titulo: "Bicicleta MTB Trail Pro",
    descripcion: "Bicicleta de montaña profesional con suspensión delantera de 150mm",
    precio: 45999,
    categoria: "Deportes",
    stock: 4,
  },
  "nike_airmax.jpg": {
    titulo: "Nike Air Max 720",
    descripcion: "Zapatillas Nike Air Max 720 con amortiguación máxima y diseño moderno",
    precio: 12999,
    categoria: "Calzado",
    stock: 16,
  },
  "pantalon_cargo.jpg": {
    titulo: "Pantalón Cargo Militar",
    descripcion: "Pantalón cargo estilo militar con múltiples bolsillos y tela resistente",
    precio: 7999,
    categoria: "Ropa",
    stock: 19,
  },
  "parlante_rugged.jpg": {
    titulo: "Parlante Rugged Resistente",
    descripcion: "Parlante bluetooth resistente al agua y al polvo con batería de 20 horas",
    precio: 9999,
    categoria: "Audio",
    stock: 12,
  },
  "pro_xl.jpg": {
    titulo: "Teclado Pro XL Mecánico",
    descripcion: "Teclado mecánico RGB PRO XL con switches Blue y configuración inalámbrica",
    precio: 16999,
    categoria: "Periféricos",
    stock: 9,
  },
  "redragon_kumara.jpg": {
    titulo: "Redragon Kumara RGB Gamer",
    descripcion: "Teclado gaming Redragon Kumara con switches mecánicos y efectos RGB",
    precio: 4999,
    categoria: "Periféricos",
    stock: 28,
  },
  "remera-negra.jpg": {
    titulo: "Remera Negra Básica",
    descripcion: "Remera básica negra de algodón 100% con ajuste clásico",
    precio: 1999,
    categoria: "Ropa",
    stock: 50,
  },
  "remera_oversize.jpg": {
    titulo: "Remera Oversize Gris",
    descripcion: "Remera oversize de moda en color gris con cuello redondo",
    precio: 3499,
    categoria: "Ropa",
    stock: 32,
  },
  "smartwatch_v3.jpeg": {
    titulo: "SmartWatch V3 Pro",
    descripcion: "Reloj inteligente con monitor cardíaco, GPS y batería de 7 días",
    precio: 18999,
    categoria: "Tecnología Wearable",
    stock: 11,
  },
  "smartwatch_v3.jpg": {
    titulo: "SmartWatch V3 Pro",
    descripcion: "Reloj inteligente con monitor cardíaco, GPS y batería de 7 días",
    precio: 18999,
    categoria: "Tecnología Wearable",
    stock: 11,
  },
  "sportbuds.jpg": {
    titulo: "SportBuds Auriculares Deportivos",
    descripcion: "Auriculares deportivos resistentes al sudor con diseño ergonómico",
    precio: 6999,
    categoria: "Audio",
    stock: 24,
  },
  "xbox_controller.jpg": {
    titulo: "Controlador Xbox Series X",
    descripcion: "Controlador Xbox Series X inalámbrico compatible con PC y consola",
    precio: 7999,
    categoria: "Videojuegos",
    stock: 14,
  },
};

async function setupMongoDB(vendorKeycloakId) {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://mongo:27017/tienda_sol";
    console.log(`Conectando a MongoDB en: ${mongoUri}`);

    await mongoose.connect(mongoUri);
    console.log("✓ Conectado a MongoDB");

    // Verificar si el usuario ya existe
    const usuarioExistente = await UsuarioModel.findOne({
      idKeycloak: vendorKeycloakId,
    });

    let usuarioId;

    if (usuarioExistente) {
      console.log(
        `✓ Usuario vendedor ya existe con ID MongoDB: ${usuarioExistente._id}`
      );
      usuarioExistente.idKeycloak = vendorKeycloakId;
      await usuarioExistente.save();
      usuarioId = usuarioExistente._id;
    } else {
      // Crear usuario vendedor
      console.log("\nCreando usuario vendedor en MongoDB...");
      const usuario = new UsuarioModel({
        idKeycloak: vendorKeycloakId,
        nombre: "Vendedor Tienda Sol",
        email: "vendedor@tienda.com",
        telefono: "+34666777888",
        tipo: "vendedor",
        fechaAlta: new Date(),
      });

      const usuarioGuardado = await usuario.save();
      usuarioId = usuarioGuardado._id;
      console.log(`✓ Usuario vendedor creado con ID MongoDB: ${usuarioId}`);
    }

    // Limpiar productos existentes de este vendedor (opcional)
    // await ProductoModel.deleteMany({ vendedor: usuarioId });

    // Crear productos
    console.log("\nCreando productos...");
    let productosCreados = 0;
    const moneda = {
      codigo: "ARS",
      simbolo: "$",
      nombre: "Peso Argentino",
    };

    for (const [nombreImagen, info] of Object.entries(productosInfo)) {
      const productoExistente = await ProductoModel.findOne({
        titulo: info.titulo,
        vendedor: usuarioId,
      });

      if (!productoExistente) {
        const producto = new ProductoModel({
          vendedor: usuarioId,
          titulo: info.titulo,
          descripcion: info.descripcion,
          precio: info.precio,
          categoria: info.categoria,
          fotos: nombreImagen,
          stock: info.stock,
          activo: true,
          moneda: moneda,
        });

        await producto.save();
        productosCreados++;
        console.log(`  ✓ ${info.titulo}`);
      } else {
        console.log(`  - ${info.titulo} (ya existe)`);
      }
    }

    console.log(`\n✓ ${productosCreados} productos creados/verificados`);

    // Mostrar resumen
    const totalProductos = await ProductoModel.countDocuments({
      vendedor: usuarioId,
    });
    console.log("\n====================================");
    console.log("Configuración de MongoDB completada");
    console.log("====================================");
    console.log(`Usuario vendedor ID: ${usuarioId}`);
    console.log(`Usuario Keycloak ID: ${vendorKeycloakId}`);
    console.log(`Total de productos: ${totalProductos}`);
    console.log("====================================\n");

    await mongoose.disconnect();
    console.log("✓ Desconectado de MongoDB\n");
  } catch (error) {
    console.error("Error durante la configuración de MongoDB:", error);
    process.exit(1);
  }
}

// Obtener el ID del usuario de Keycloak desde argumentos
const vendorKeycloakId = process.argv[2];

if (!vendorKeycloakId) {
  console.error(
    "Error: Debe proporcionar el ID del usuario de Keycloak como argumento"
  );
  console.error("Uso: node setup-mongodb.js <keycloak-user-id>");
  process.exit(1);
}

setupMongoDB(vendorKeycloakId);
