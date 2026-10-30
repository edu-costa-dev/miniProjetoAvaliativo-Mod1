import { buscarClientes } from "./clientes";
import { buscarProduto } from "./produtos";
import { itemCarrinho } from "./types";

type itemCarrinhoDetalhado = itemCarrinho & {
    nomeProduto: string;
    precoUnitario: number;
    subtotal: number;
};

function adicionarItem(clienteId: number, produtoId: number, quantidade: number): void {
    validarQuantidade(quantidade);
    const produtoAtual = buscarProduto(produtoId);
    if (!produtoAtual) {
        throw new Error(`Produto com ID ${produtoId} não encontrado.`);
    }

    const carrinho = obterCarrinho(clienteId);
    const itemExistente = carrinho.find((item) => item.produtoId === produtoId);
    const novaQuantidade = (itemExistente?.quantidade ?? 0) + quantidade;
    if (novaQuantidade > produtoAtual.estoque) {
        throw new Error(`Estoque insuficiente para "${produtoAtual.nome}". Disponível: ${produtoAtual.estoque}.`);
    }

    if (itemExistente) {
        itemExistente.quantidade = novaQuantidade;
    } else {
        carrinho.push({ produtoId, quantidade });
    }
}

function removerItem(clienteId: number, produtoId: number): void {
    const carrinho = obterCarrinho(clienteId);
    const indice = carrinho.findIndex((item) => item.produtoId === produtoId);
    if (indice === -1) {
        throw new Error(`Produto com ID ${produtoId} não está no carrinho.`);
    }
    carrinho.splice(indice, 1);
}


function validarQuantidade(quantidade: number): void {
    if (!Number.isInteger(quantidade) || quantidade <= 0) {
        throw new Error("A quantidade deve ser um número inteiro maior que zero.");
    }
}

function alterarQuantidade(clienteId: number, produtoId: number, quantidade: number): void {
    validarQuantidade(quantidade);
    const carrinho = obterCarrinho(clienteId);
    const item = carrinho.find((itemAtual) => itemAtual.produtoId === produtoId);
    if (!item) {
        throw new Error(`Produto com ID ${produtoId} não está no carrinho.`);
    }

    const produtoAtual = buscarProduto(produtoId);
    if (!produtoAtual) {
        throw new Error(`Produto com ID ${produtoId} não encontrado.`);
    }
    if (quantidade > produtoAtual.estoque) {
        throw new Error(`Estoque insuficiente para "${produtoAtual.nome}". Disponível: ${produtoAtual.estoque}.`);
    }
    item.quantidade = quantidade;
}

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
    limparCarrinho,
    alterarQuantidade,
    adicionarItem,
    removerItem,

};
export type { itemCarrinhoDetalhado };
