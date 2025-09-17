import logger from "../../logger/logger.js";

export default class UsuarioService {
  constructor(pedidoRepository, usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
    this.pedidoRepository = pedidoRepository;
  }

  findPedidosByUsuariosId(idUsuario) {
    logger.info(
      `Buscando pedidos del usuario con id:  ${idUsuario} en el servicio`,
    );
    const pedidos = this.pedidoRepository.findByUsuariosId(idUsuario);
    return pedidos;
  }

  /*createUsuario(usuario) {
    logger.info("Creando un nuevo usuario y agregandolo al repo: " + JSON.stringify(usuario));
    const usuarioCreado = this.usuarioRepository.create(usuario);
    logger.http("Usuario guardado con exito: " + JSON.stringify(usuarioCreado));
    return usuarioCreado;
  }*/
}
