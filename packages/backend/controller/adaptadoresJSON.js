export function adaptarPedidoToJson(pedido) {
  return {
    id: pedido.id,
    usuario: pedido.comprador,
    //vendedor: pedido.obtenerVendedor(),
    direccionEntrega: pedido.direccionEntrega,
    fechaCreacion: pedido.fechaCreacion,
    items: pedido.items.map((item) => ({
      titulo: item.producto.titulo,
      descripcion: item.producto.descripcion,
      cantidad: item.cantidad,
      precioUnitario: item.precioUnitario,
      stock: item.producto.stock,
    })),
    estado: pedido.estado,
    total: pedido.calcularTotal(),
    moneda: pedido.moneda,
  };
}

export function adaptarNotificacion(Notificacion) {
  if (!Notificacion) {
    return "";
  }

  return {
    usuarioDestino: Notificacion.usuario,
    mensaje: Notificacion.mensaje,
    fechaAlta: Notificacion.fechaAlta,
  };
}
