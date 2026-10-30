import type { cliente } from './types';

const clientes: cliente[] = [
    { id: 1, nome: "Ana Costa", email: "ana@example.com" },
    { id: 2, nome: "Bruno Lima", email: "bruno@example.com" },
    { id: 3, nome: "Carla Souza", email: "carla@example.com" },
];

function cadCliente(cliente: cliente): void {
        if (!Number.isInteger(cliente.id) || cliente.id <= 0) {
        console.log("O ID do cliente deve ser um número inteiro maior que zero.");
    }
    if (!cliente.nome.trim() || !cliente.email.trim()) {
        console.log("Nome e e-mail do cliente são obrigatórios.");
    }
    if (!cliente.email.includes("@")) {
        console.log("Informe um e-mail válido.");
    }
    if (clientes.some((clienteAtual) => clienteAtual.id === cliente.id)) {
        console.log(`Já existe um cliente com o ID ${cliente.id}.`);
    }
    if (clientes.some((clienteAtual) => clienteAtual.email.toLowerCase() === cliente.email.trim().toLowerCase())) {
        console.log("Já existe um cliente com esse e-mail.");
    }
    clientes.push({
        ...cliente,
        nome: cliente.nome.trim(),
        email: cliente.email.trim()
    });
}

function listarClientes(): cliente[] {
   return clientes.map((clienteAtual) => ({ ...clienteAtual }));
}

function buscarClientes(id: number): cliente | undefined {
    const clienteEncontrado = clientes.find((clienteAtual) => clienteAtual.id === id);
    return clienteEncontrado ? { ...clienteEncontrado } : undefined;
}

export {cadCliente, listarClientes, buscarClientes}
