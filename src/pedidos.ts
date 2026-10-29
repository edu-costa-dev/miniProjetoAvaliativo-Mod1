import { buscarClientes } from "./clientes";
import { calcularTotal, limparCarrinho, listarItens } from "./carrinho";
import { baixarEstoque, buscarProduto } from "./produtos";
import type { itemPedido, pedido } from "./types";

const pedidos: pedido[] = [];
let proximoId = 1;

function finalizarPedido(clienteId: number): pedido {
    if (!buscarClientes(clienteId)) {
        throw new Error(`Cliente com ID ${clienteId} não encontrado.`);
    }

    const itensCarrinho = listarItens(clienteId);
    if (itensCarrinho.length === 0) {
        throw new Error("Não é possível finalizar um pedido sem itens.");
    }

    const itensPedido: itemPedido[] = itensCarrinho.map((item) => {
        const produtoAtual = buscarProduto(item.produtoId);
        if (!produtoAtual) {
            throw new Error(`Produto com ID ${item.produtoId} não encontrado.`);
        }
        if (item.quantidade > produtoAtual.estoque) {
            throw new Error(`Estoque insuficiente para "${produtoAtual.nome}".`);
        }
        return {
            produtoId: produtoAtual.id,
            nomeProduto: produtoAtual.nome,
            categoria: produtoAtual.categoria,
            quantidade: item.quantidade,
            precoUnitario: produtoAtual.preco,
            subtotal: produtoAtual.preco * item.quantidade,
        };
    });

    const novoPedido: pedido = {
        id: proximoId,
        clienteId,
        itens: itensPedido,
        total: calcularTotal(clienteId),
        data: new Date().toISOString(),
    };

    itensPedido.forEach((item) => {
        baixarEstoque(item.produtoId, item.quantidade);
    });
    pedidos.push(novoPedido);
    proximoId += 1;
    limparCarrinho(clienteId);

    return {
        ...novoPedido,
        itens: novoPedido.itens.map((item) => ({ ...item })),
    };
}

function listarPedidos(): pedido[] {
    return pedidos.map((pedidoAtual) => ({
        ...pedidoAtual,
        itens: pedidoAtual.itens.map((item) => ({ ...item })),
    }));
}

function listarPedidosPorCliente(clienteId: number): pedido[] {
    return listarPedidos().filter((pedidoAtual) => pedidoAtual.clienteId === clienteId);
}

export { finalizarPedido, listarPedidos, listarPedidosPorCliente };