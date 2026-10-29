type cliente = {
    id: number
    nome: string
    email: string
}

type produto = {
    id: number;
    nome: string;
    categoria: string;
    preco: number;
    estoque: number;
};

type itemCarrinho = {
    produtoId: number;
    quantidade: number;
};

type itemPedido = {
    produtoId: number;
    nomeProduto: string;
    categoria: string;
    quantidade: number;
    precoUnitario: number;
    subtotal: number;
};

type pedido = {
    id: number;
    clienteId: number;
    itens: itemPedido[];
    total: number;
    data: string;
};

export type {
    cliente,
    produto,
    itemCarrinho,
    itemPedido,
    pedido
};