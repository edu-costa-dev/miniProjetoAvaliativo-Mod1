import promptSync from "prompt-sync";
import { cadCliente,listarClientes } from "./clientes";
import type { cliente } from "./types";

const prompt = promptSync({sigint: true})

const indiceClientes = 1;

const nomeCliente = prompt("Digite o nome do cliente: ");
const emailCliente = prompt(`Digite o e-mail principal do ${nomeCliente}: `);

const novoCliente: cliente = {
    id: indiceClientes,
    nome: nomeCliente,
    email: emailCliente,
}

cadCliente(novoCliente)