import { buscarClientes } from "./clientes";
import { buscarProduto } from "./produtos";
import { itemCarrinho } from "./types";

type itemCarrinhoDetalhado = itemCarrinho & {
    nomeProduto: string;
    precoUnitario: number;
    subtotal: number;
};


function limparCarrinho(clienteId: number): void {
    obterCarrinho(clienteId).length = 0;
}

function listarItens(clienteId: number): itemCarrinhoDetalhado[] {
    return obterCarrinho(clienteId).map((item) => {
        const produtoAtual = buscarProduto(item.produtoId);
        if (!produtoAtual) {
            throw new Error(`Produto com ID ${item.produtoId} não encontrado.`);
        }
        return {
            ...item,
            nomeProduto: produtoAtual.nome,
            precoUnitario: produtoAtual.preco,
            subtotal: produtoAtual.preco * item.quantidade,
        };
    });
}

function calcularTotal(clienteId: number): number {
    return listarItens(clienteId).reduce((total, item) => total + item.subtotal, 0);
}

const carrinhos = new Map<number, itemCarrinho[]>();

function obterCarrinho(clienteId: number): itemCarrinho[] {
    if (!buscarClientes(clienteId)) {
        throw new Error(`Cliente com ID ${clienteId} não encontrado.`);
    }
    const carrinho = carrinhos.get(clienteId);
    if (!carrinho) {
        const novoCarrinho: itemCarrinho[] = [];
        carrinhos.set(clienteId, novoCarrinho);
        return novoCarrinho;
    }
    return carrinho;
}

export {
    obterCarrinho,
    calcularTotal,
    listarItens,
    limparCarrinho
};
export type { itemCarrinhoDetalhado };
