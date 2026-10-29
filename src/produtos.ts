import type { produto } from "./types";

const produtos: produto[] = [
    { id: 1, nome: "Teclado mecânico", categoria: "Periféricos", preco: 250, estoque: 8 },
    { id: 2, nome: "Mouse sem fio", categoria: "Periféricos", preco: 120, estoque: 10 },
    { id: 3, nome: "Monitor 24 polegadas", categoria: "Monitores", preco: 900, estoque: 5 },
];

function baixarEstoque(id: number, quantidade: number): void {
    const produtoAtual = produtos.find((produtoDoCatalogo) => produtoDoCatalogo.id === id);
    if (!produtoAtual) {
        throw new Error(`Produto com ID ${id} não encontrado.`);
    }
    if (!Number.isInteger(quantidade) || quantidade <= 0 || quantidade > produtoAtual.estoque) {
        throw new Error(`Não há estoque suficiente do produto "${produtoAtual.nome}".`);
    }
    produtoAtual.estoque -= quantidade;
}

function listarProdutos(): produto[] {
    return produtos.map((produtoAtual) => ({ ...produtoAtual }));
}

function buscarProduto(id: number): produto | undefined {
    const produtoEncontrado = produtos.find((produtoAtual) => produtoAtual.id === id);
    return produtoEncontrado ? { ...produtoEncontrado } : undefined;
}

function buscarProdutosPorNome(nome: string): produto[] {
    const busca = nome.trim().toLowerCase();
    return produtos
        .filter((produtoAtual) => produtoAtual.nome.toLowerCase().includes(busca))
        .map((produtoAtual) => ({ ...produtoAtual }));
}

function filtrarProdutosPorCategoria(categoria: string): produto[] {
    const busca = categoria.trim().toLowerCase();
    return produtos
        .filter((produtoAtual) => produtoAtual.categoria.toLowerCase() === busca)
        .map((produtoAtual) => ({ ...produtoAtual }));
}

function atualizarProduto(id: number, atualizacao: Partial<Omit<produto, "id">>): void {
    const indice = produtos.findIndex((produtoAtual) => produtoAtual.id === id);
    if (indice === -1) {
        throw new Error(`Produto com ID ${id} não encontrado.`);
    }

    const produtoAtualizado = { ...produtos[indice]!, ...atualizacao };
    validarProduto(produtoAtualizado);
    produtoAtualizado.nome = produtoAtualizado.nome.trim();
    produtoAtualizado.categoria = produtoAtualizado.categoria.trim();
    produtos[indice] = produtoAtualizado;
}

function removerProduto(id: number): void {
    const indice = produtos.findIndex((produtoAtual) => produtoAtual.id === id);
    if (indice === -1) {
        throw new Error(`Produto com ID ${id} não encontrado.`);
    }
    produtos.splice(indice, 1);
}

function validarProduto(produtoAtual: produto): void {
    if (!Number.isInteger(produtoAtual.id) || produtoAtual.id <= 0) {
        throw new Error("O ID do produto deve ser um número inteiro maior que zero.");
    }
    if (!produtoAtual.nome.trim()) {
        throw new Error("O nome do produto é obrigatório.");
    }
    if (!produtoAtual.categoria.trim()) {
        throw new Error("A categoria do produto é obrigatória.");
    }
    if (!Number.isFinite(produtoAtual.preco) || produtoAtual.preco <= 0) {
        throw new Error("O preço do produto deve ser maior que zero.");
    }
    if (!Number.isInteger(produtoAtual.estoque) || produtoAtual.estoque < 0) {
        throw new Error("O estoque deve ser um número inteiro igual ou maior que zero.");
    }
}

function cadProduto(novoProduto: produto): void {
    if (produtos.some((produtoAtual) => produtoAtual.id === novoProduto.id)) {
        throw new Error(`Já existe um produto com o ID ${novoProduto.id}.`);
    }
    validarProduto(novoProduto);
    produtos.push({
        ...novoProduto,
        nome: novoProduto.nome.trim(),
        categoria: novoProduto.categoria.trim(),
    });
}

export {
    cadProduto,
    listarProdutos,
    validarProduto,
    buscarProduto,
    buscarProdutosPorNome,
    filtrarProdutosPorCategoria,
    atualizarProduto,
    removerProduto,
    baixarEstoque,
};
