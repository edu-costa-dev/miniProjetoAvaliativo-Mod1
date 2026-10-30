import { listarPedidos, listarPedidosPorCliente } from "./pedidos";

type relatorioVendas = {
    quantidadePedidos: number;
    totalVendido: number;
    unidadesVendidas: number;
};

type vendaPorProduto = {
    produtoId: number;
    nomeProduto: string;
    categoria: string;
    unidadesVendidas: number;
    quantidadePedidos: number;
    totalVendido: number;
};

type vendaPorCategoria = {
    categoria: string;
    unidadesVendidas: number;
    quantidadePedidos: number;
    totalVendido: number;
};

function gerarRelatorioVendas(clienteId?: number): relatorioVendas {
    const pedidos = clienteId === undefined
        ? listarPedidos()
        : listarPedidosPorCliente(clienteId);

    return pedidos.reduce<relatorioVendas>((relatorio, pedidoAtual) => {
        relatorio.quantidadePedidos += 1;
        relatorio.totalVendido += pedidoAtual.total;
        relatorio.unidadesVendidas += pedidoAtual.itens.reduce(
            (total, item) => total + item.quantidade,
            0,
        );
        return relatorio;
    }, { quantidadePedidos: 0, totalVendido: 0, unidadesVendidas: 0 });
}

function gerarVendasPorCategoria(): vendaPorCategoria[] {
    const vendas = new Map<string, vendaPorCategoria>();
    for (const pedidoAtual of listarPedidos()) {
        const categoriasNoPedido = new Set<string>();
        for (const item of pedidoAtual.itens) {
            const venda = vendas.get(item.categoria) ?? {
                categoria: item.categoria,
                unidadesVendidas: 0,
                quantidadePedidos: 0,
                totalVendido: 0,
            };
            venda.unidadesVendidas += item.quantidade;
            venda.totalVendido += item.subtotal;
            vendas.set(item.categoria, venda);
            categoriasNoPedido.add(item.categoria);
        }
        for (const categoria of categoriasNoPedido) {
            vendas.get(categoria)!.quantidadePedidos += 1;
        }
    }

    return Array.from(vendas.values());
}

function gerarVendasPorProduto(): vendaPorProduto[] {
    const vendas = new Map<number, vendaPorProduto>();
    const pedidosPorProduto = new Map<number, Set<number>>();
    for (const pedidoAtual of listarPedidos()) {
        for (const item of pedidoAtual.itens) {
            const venda = vendas.get(item.produtoId) ?? {
                produtoId: item.produtoId,
                nomeProduto: item.nomeProduto,
                categoria: item.categoria,
                unidadesVendidas: 0,
                quantidadePedidos: 0,
                totalVendido: 0,
            };
            venda.unidadesVendidas += item.quantidade;
            venda.totalVendido += item.subtotal;
            vendas.set(item.produtoId, venda);

            const pedidos = pedidosPorProduto.get(item.produtoId) ?? new Set<number>();
            pedidos.add(pedidoAtual.id);
            pedidosPorProduto.set(item.produtoId, pedidos);
        }
    }

    return Array.from(vendas.values()).map((venda) => ({
        ...venda,
        quantidadePedidos: pedidosPorProduto.get(venda.produtoId)?.size ?? 0,
    }));
}

function gerarVendasPorProdutoId(produtoId: number): vendaPorProduto {
    const venda = gerarVendasPorProduto().find((item) => item.produtoId === produtoId);
    if (venda) {
        return venda;
    }
    return {
        produtoId,
        nomeProduto: "Sem vendas registradas",
        categoria: "-",
        unidadesVendidas: 0,
        quantidadePedidos: 0,
        totalVendido: 0,
    };
}

export { gerarRelatorioVendas, gerarVendasPorCategoria, gerarVendasPorProduto, gerarVendasPorProdutoId };
export type { relatorioVendas, vendaPorProduto };
