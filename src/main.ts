import promptSync from "prompt-sync";
import {
        cadCliente,
        listarClientes,
        buscaClientes,
        buscarClientes
        } from "./clientes";
import type {
            cliente
            } from "./types";

const prompt = promptSync({sigint: true})
//===========================================================================================================================



//===========================================================================================================================



//===========================================================================================================================



//===========================================================================================================================



//===========================================================================================================================

//Função ler texto (nome)
function lerClienteNome(pergunta: string): string {
    const valor = prompt(pergunta).trim();
    if (!valor) {
        throw new Error("O campo não pode ficar vazio e deve conter letras");
    }
    return valor;
}

//Função de ler numero:
function lerClienteID(pergunta: string): number{
    const clienteID = Number(prompt(pergunta));
    if (!Number.isInteger(clienteID)) {
        console.log(`Digite um numero inteiro válido! `);
    }
    return clienteID;
}

//Consultar cliente pelo ID
function selecionaCliente(): cliente | undefined {
    const tipoBusca = prompt(`Escolha qual o tipo de informação que deseja consultar o cliente:
        [1] - ID
        [2] - Nome
        [0] - Voltar`).trim();
    if ( tipoBusca === "1"){
        const id = lerClienteID(`Digite a ID do Cliente: `);
        const clienteEncontrado = buscarClientes(id);
        if (!clienteEncontrado){
            console.log(`Cliente com ID ${id}, não encontrado.`);
            return undefined;
        }
        return clienteEncontrado!;
    }
    if (tipoBusca === "2"){
        const nome = lerClienteNome(`Digite o nome ou parte do nome do cliente para realizar a busca: `);
        const buscaCliente = listaDeClientes().filter((clienteAtual)=>
            clienteAtual.nome.includes(nome),
    );
    if (tipoBusca.length === 0){
        console.log(`Nenhum cliente encontrado com esse nome...`);
    }
    if (tipoBusca.length === 1){
        return tipoBusca[0]!;
    }
    console.log(tipoBusca);
    const id = lerClienteID(`Há mais de um resultado. Digite o ID desejado: `);
    const clienteEscolhido = tipoBusca.find((clienteAtual) => clienteAtual.id === id);
    if (!clienteEscolhido){
        console.log(`O ID informado não está enre os clientes encontrados.`);
    }
    console.log(`Escolha 1 para buscar por ID ou 2 para buscar por NOME.`);
    }
}

//===========================================================================================================================

//Função de Cadastrar Cliente:
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

//Menu Principal -> Cadastro/Consulta de Clientes
function subMenuClientes(): void{
    let opcaoDoMenu = "";
    while (opcaoDoMenu !== "0") {
        console.log(`
            |====| Menu de Cadastro de CLIENTES |====|
            O que deseja fazer?
            [1] - Cadastrar Novo Cliente
            [2] - Relatório de Clientes
            [3] - Consulta por ID
            [4] - Consulpa por Nome
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
                    const clienteAtual = buscarClientes(lerClienteID(`Digite o ID do cliente: `))
                    if (!clienteAtual){
                        throw new Error(`Cliente não encontrado.`)
                    }
                    console.log(clienteAtual);
                });
                break;
            case "4":
                executarAcao(() => {
                    const nome = lerClienteNome(`Digite o nome (ou parte) do cliente: `).toLowerCase();
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
                    break;
                case "3":
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
