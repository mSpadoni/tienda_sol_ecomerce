import Notificacion from "../../../models/entities/Notificacion.js";
import Usuario from "../../../models/entities/Usuario.js";
import { TipoUsuario } from "../../../models/entities/TipoUsuario.js";

describe("test Notificacion", () => {
	let usuario;
	beforeEach(() => {
		usuario = new Usuario(
			"user-1",
			"Juan Ignacio Millan",
			"jmillan@frba.utn.edu.ar",
			"123456789",
			TipoUsuario.COMPRADOR,
			new Date("2025-10-12")
		);
	});

	test("debería crear una notificación con los datos correctos y no leída por defecto", () => {
		const mensaje = "Mensaje de prueba";
		const fecha = new Date("2025-10-12");
		const notificacion = new Notificacion(usuario, mensaje, fecha);
		expect(notificacion.usuario).toBe(usuario);
		expect(notificacion.mensaje).toBe(mensaje);
		expect(notificacion.fechaAlta).toBe(fecha);
		expect(notificacion.leida).toBe(false);
		expect(notificacion.fechaLeida).toBeNull();
	});

	test("debería marcar la notificación como leída y asignar fechaLeida", () => {
		const notificacion = new Notificacion(usuario, "msg", new Date());
		expect(notificacion.leida).toBe(false);
		notificacion.marcarComoLeida();
		expect(notificacion.leida).toBe(true);
		expect(notificacion.fechaLeida).toBeInstanceOf(Date);
	});

	test("debería indicar correctamente si está leída", () => {
		const notificacion = new Notificacion(usuario, "msg", new Date());
		expect(notificacion.estaLeida()).toBe(false);
		notificacion.marcarComoLeida();
		expect(notificacion.estaLeida()).toBe(true);
	});
});
