import Pedido from "../model/Pedido.js";

export class PedidoRepository {
    constructor() {
        this.pedidos = [];
    }
    save(pedido) {
        this.pedidos.push(pedido);
    }
    findAll() {
        return this.pedidos;
    }
    findById(id) {
        return this.pedidos.find(p => p.id === id);
    }
    deleteById(id) {
        this.pedidos = this.pedidos.filter(p => p.id !== id);
    }  
    updateById(id, updatedPedido) {
        const index = this.pedidos.findIndex(p => p.id === id);
        if (index !== -1) {
            this.pedidos[index] = { ...this.pedidos[index], ...updatedPedido };
        }
    }
}   