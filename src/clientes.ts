import type { cliente } from './types';

const clientes: cliente[] = [
    { id: 1, nome: "Ana Costa", email: "ana@example.com" },
    { id: 2, nome: "Bruno Lima", email: "bruno@example.com" },
    { id: 3, nome: "Carla Souza", email: "carla@example.com" },
];

function cadCliente(cliente: cliente): void {
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
