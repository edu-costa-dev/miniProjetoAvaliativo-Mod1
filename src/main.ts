import promptSync from "prompt-sync";
import {
        cadCliente,
        listarClientes,
        buscarClientes
        } from "./clientes";
import type {
            cliente,
            produto
            } from "./types";
import {
            listarProdutos,
            cadProduto,
            validarProduto,
            buscarProduto,
            buscarProdutosPorNome,
            filtrarProdutosPorCategoria,
            atualizarProduto,
            removerProduto
} from "./produtos";

import { calcularTotal, itemCarrinhoDetalhado, obterCarrinho } from "./carrinho";
import { finalizarPedido, listarPedidos, listarPedidosPorCliente } from "./pedidos";

const prompt = promptSync({sigint: true})
const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
//===========================================================================================================================



//===========================================================================================================================



//===========================================================================================================================

//Listar itens
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

//Imprimir carrinho
function imprimirCarrinho(clienteAtual: cliente): void {
    const itens = listarItens(clienteAtual.id);
    console.log(`\nCarrinho de ${clienteAtual.nome} (ID ${clienteAtual.id})`);
    if (itens.length === 0) {
        console.log("O carrinho está vazio.");
        return;
    }
    console.table(itens.map((item) => ({
        produtoId: item.produtoId,
        produto: item.nomeProduto,
        quantidade: item.quantidade,
        precoUnitario: moeda.format(item.precoUnitario),
        subtotal: moeda.format(item.subtotal),
    })));
    console.log(`Total da compra: ${moeda.format(calcularTotal(clienteAtual.id))}`);
}

//Revisar e Finalizar carrinho
function executarComCarrinho(acao: (clienteAtual: cliente) => void): void {
    const clienteAtual = selecionaCliente();
    if (!clienteAtual) return;
    acao(clienteAtual);
}

//Menu Principal -> Cadastro/Consulta de PEDIDOS
function menuPedidos(): void {
    let opcao = "";
    while (opcao !== "0") {
        console.log("\n=== Pedidos ===");
        console.log("1 - Revisar carrinho e finalizar pedido");
        console.log("2 - Consultar todos os pedidos");
        console.log("3 - Consultar pedidos de um cliente");
        console.log("0 - Voltar");
        opcao = prompt("Escolha: ").trim();
        switch (opcao) {
            case "1":
                executarAcao(() => executarComCarrinho((clienteAtual) => {
                    imprimirCarrinho(clienteAtual);
                    if (listarItens(clienteAtual.id).length === 0) {
                        throw new Error("Adicione produtos ao carrinho antes de finalizar.");
                    }
                    const confirmar = prompt("Deseja finalizar a compra? (s/n): ").trim().toLowerCase();
                    if (confirmar !== "s") {
                        console.log("Finalização cancelada; o carrinho foi mantido.");
                        return;
                    }
                    const pedido = finalizarPedido(clienteAtual.id);
                    console.log(`Pedido #${pedido.id} finalizado. Total: ${moeda.format(pedido.total)}`);
                }));
                break;
            case "2":
                console.table(listarPedidos().map((pedido) => ({
                    id: pedido.id,
                    clienteId: pedido.clienteId,
                    data: pedido.data,
                    total: moeda.format(pedido.total),
                })));
                break;
            case "3":
                executarAcao(() => {
                    const clienteAtual = selecionaCliente();
                    const pedidos = listarPedidosPorCliente(clienteAtual.id);
                    console.table(pedidos.map((pedido) => ({
                        id: pedido.id,
                        data: pedido.data,
                        total: moeda.format(pedido.total),
                    })));
                    if (pedidos.length === 0) {
                        console.log("Esse cliente ainda não tem pedidos.");
                    }
                });
                break;
            case "0":
                break;
            default:
                console.log("Opção inválida.");
        }
    }
}

//===========================================================================================================================

//Função de cadastrar PRODUTO
function cadastrarProduto(): void {
    const nome = lerTexto("Nome do produto: ");
    const categoria = lerTexto("Categoria: ");
    const preco = lerNumero("Preço: R$ ");
    const estoque = lerNumero("Quantidade inicial em estoque: ");
    const proximoId = Math.max(0, ...listarProdutos().map((produtoAtual) => produtoAtual.id)) + 1;
    cadProduto({ id: proximoId, nome, categoria, preco, estoque });
    console.log(`Produto cadastrado com o ID ${proximoId}.`);
}

//Menu Principal -> Cadastro/Consulta de PRODUTOS
function subMenuProdutos(): void{
    let opcaoDoMenu = "";
    while (opcaoDoMenu !== "0") {
        console.log(`
            [1] - Cadastrar novo Produto
            [2] - Consultar todos os produtos cadastrados
            [3] - Consultar PRODUTO pelo ID
            [4] - Consultar PRODUTO pelo NOME
            [5] - Filtrar PRODUTOS pela CATEGORIA
            [6] - Atualizar dados PRODUTOS
            [7] - Remover PRODUTO
            [0] - Voltar
                    `)
        opcaoDoMenu = prompt(`Digite uma opção: `)
        switch (opcaoDoMenu) {
            case "1":
                executarAcao(cadastrarProduto);
                break;
            case "2":
                console.log(listarProdutos());
                break;
            case "3":
                executarAcao(() => {
                    const produtoAtual = buscarProduto(lerNumero("ID do produto: "));
                    if (!produtoAtual) {
                        console.log("Produto não encontrado.");
                    }
                    console.log(produtoAtual);
                });
                break;
            case "4":
                executarAcao(() => {
                    const encontrados = buscarProdutosPorNome(lerTexto("Nome ou parte do nome: "));
                    console.log(encontrados);
                    if (encontrados.length === 0) {
                        console.log("Nenhum produto encontrado.");
                    }
                });
                break;
            case "5":
                executarAcao(() => {
                    const encontrados = filtrarProdutosPorCategoria(lerTexto("Categoria: "));
                    console.log(encontrados);
                    if (encontrados.length === 0) {
                        console.log("Nenhum produto encontrado nessa categoria.");
                    }
                });
                break;
            case "6":
                executarAcao(() => {
                    const id = lerNumero("ID do produto: ");
                    const produtoAtual = buscarProduto(id);
                    if (!produtoAtual) {
                        console.log("Produto não encontrado.");
                        return;
                    }
                    const nome = prompt(`Nome [${produtoAtual.nome}]: `).trim();
                    const categoria = prompt(`Categoria [${produtoAtual.categoria}]: `).trim();
                    const precoDigitado = prompt(`Preço [${produtoAtual.preco}]: `).trim();
                    const estoqueDigitado = prompt(`Estoque [${produtoAtual.estoque}]: `).trim();
                    const atualizacao: Partial<Omit<produto, "id">> = {};
                    if (nome) atualizacao.nome = nome;
                    if (categoria) atualizacao.categoria = categoria;
                    if (precoDigitado) atualizacao.preco = Number(precoDigitado.replace(",", "."));
                    if (estoqueDigitado) atualizacao.estoque = Number(estoqueDigitado);
                    atualizarProduto(id, atualizacao);
                    console.log("Produto atualizado.");
                });
                break;
            case "7":
                executarAcao(() => {
                    const id = lerNumero("ID do produto a remover: ");
                    removerProduto(id);
                    console.log("Produto removido.");
                });
                break;
            case "0":
                break;
            default:
                console.log("Digite um numero válido.");
        }
    }
}

//===========================================================================================================================

//Função ler texto (nome)
function lerTexto(pergunta: string): string {
    const valor = prompt(pergunta).trim();
    if (!valor) {
        throw new Error("O campo não pode ficar vazio e deve conter letras");
    }
    return valor;
}

//Função de ler numero:
function lerNumero(pergunta: string): number{
    const clienteID = Number(prompt(pergunta));
    if (!Number.isInteger(clienteID)) {
        console.log(`Digite um numero inteiro válido! `);
    }
    return clienteID;
}

//Consultar CLIENTE pelo ID
function selecionaCliente(): cliente | undefined {
    const tipoBusca = prompt(`Escolha qual o tipo de informação que deseja consultar o cliente:
        [1] - ID
        [2] - Nome
        [0] - Voltar`).trim();
    if ( tipoBusca === "1"){
        const id = lerNumero(`Digite a ID do Cliente: `);
        const clienteEncontrado = buscarClientes(id);
        if (!clienteEncontrado){
            console.log(`Cliente com ID ${id}, não encontrado.`);
            return undefined;
        }
        return clienteEncontrado!;
    }
    if (tipoBusca === "2"){
        const nome = lerTexto(`Digite o nome ou parte do nome do cliente para realizar a busca: `);
        const buscaCliente = listarClientes().filter((clienteAtual)=>
            clienteAtual.nome.includes(nome),
    );
    if (buscaCliente.length === 0){
        console.log(`Nenhum cliente encontrado com esse nome...`);
    }
    if (buscaCliente.length === 1){
        return buscaCliente[0]!;
    }
    console.log(buscaCliente);
    const id = lerNumero(`Há mais de um resultado. Digite o ID desejado: `);
    const clienteEscolhido = buscaCliente.find((clienteAtual) => clienteAtual.id === id);
    if (!clienteEscolhido){
        console.log(`O ID informado não está enre os clientes encontrados.`);
    }
    console.log(`Escolha 1 para buscar por ID ou 2 para buscar por NOME.`);
    return clienteEscolhido;
    }
}

//===========================================================================================================================

//Função de Cadastrar CLIENTES:
function cadClientes(): void{
    const nome: string = prompt(`Digite o nome do novo cliente: `)
    const email: string = prompt(`Digite o email do novo cliente: `);
    const proximoId = Math.max(0, ...listarClientes().map((clienteAtual) => clienteAtual.id)) + 1;
    cadCliente({ id: proximoId, nome, email });
    console.log(`Cliente cadastrado com o ID ${proximoId}.`);
}

//===========================================================================================================================

//Tratamento de erros. Objetivo é executar a função que passar como argumento de forma segura, capturando falhas para evitar que o programa quebre inesperadamente.
function executarAcao(acao: () => void): void {
    try {
        acao();
    } catch (erro) {
        if (!(erro instanceof Error)) {
            throw erro;
        }
        console.log(`\nNão foi possível concluir: ${erro.message}`);
    }
}

//===========================================================================================================================

//Menu Principal -> Cadastro/Consulta de CLIENTES
function subMenuClientes(): void{
    let opcaoDoMenu = "";
    while (opcaoDoMenu !== "0") {
        console.log(`
            |====| Menu de Cadastro de CLIENTES |====|
            O que deseja fazer?
            [1] - Cadastrar novo Cliente
            [2] - Relatório de Clientes
            [3] - Consulta por ID
            [4] - Consulta por Nome
            [0] - Voltar
            `);
        opcaoDoMenu = prompt("Digite um numero para selecionar o menu acima: ");
        switch (opcaoDoMenu){
            case "1":
                executarAcao(cadClientes);
                break;
            case "2":
                console.log(listarClientes());
                break
            case "3":
                executarAcao(() => {
                    const clienteAtual = buscarClientes(lerNumero(`Digite o ID do cliente: `))
                    if (!clienteAtual){
                        throw new Error(`Cliente não encontrado.`)
                    }
                    console.log(clienteAtual);
                });
                break;
            case "4":
                executarAcao(() => {
                    const nome = lerTexto(`Digite o nome (ou parte) do cliente: `).toLowerCase();
                    const encontrado = listarClientes().filter((clienteAtual)=>
                        clienteAtual.nome.toLowerCase().includes(nome),
                    );
                    console.log(encontrado);
                    if (encontrado.length === 0){
                        console.log(`Não foi encontrado nenhum cliente com esse nome.`);
                    }
                });
                break;
            case "0":
                break;
            default:
        console.log("Opção inválida. Tente novamente.");
        break;
        }
    }
}

//===========================================================================================================================

//Menu Principal:
function menuPrincipal(): void {
    let opcaoDoMenu = "";
    while (opcaoDoMenu !== "0") {
        console.log(`
            |====| E-Commerce |====|
            O que deseja fazer?
            [1] - Cadastro/Consulta de Clientes
            [2] - Cadastro/Consulta de Produtos
            [3] - Incluir/Consultar Pedidos
            [4] - Incluir/Consultar Carrinho de Compras
            [5] - Consultar Estoque
            [6] - Relatórios
            [0] - Sair
            `);
            opcaoDoMenu = prompt("Digite um numero para selecionar o menu acima: ");
            switch (opcaoDoMenu){
                case "1":
                    subMenuClientes();
                    break;
                case "2":
                    subMenuProdutos();
                    break;
                case "3":
                    subMenuPedidos()
                    break;
                case "4":
                    break;
                case "5":
                    break;
                case "6":
                    break;
                case "7":
                    break;
                case "0":
                    console.log(`Sistema finalizado pelo usuário. Até logo! ♥`);
                    break;
                default:
                    console.log(`Digite um valor do tipo numero de acordo com a opção do menu que você deseja: `);
                    break;
        }
    }
}
menuPrincipal()

//===========================================================================================================================
