
## Informações do projeto

| Informação      | Detalhes                                                                 |
| ----------------- | ------------------------------------------------------------------------ |
| Estudante e turma | Antonio Eduardo da Costa - Turma 6                                       |
| Objetivo          | Gerenciar produtos, clientes, carrinhos, pedidos e relatórios de vendas |
| Tecnologias       | TypeScript e Node.js                                                     |

## Funcionalidades

- Cadastro, listagem, busca, filtro, atualização e remoção de produtos.
- Cadastro e consulta de clientes, com três clientes de exemplo carregados no início.
- Carrinhos separados por cliente, com inclusão, remoção, alteração de quantidade e cálculo de subtotais e total.
- Finalização de pedidos, registro do preço praticado, atualização do estoque e consulta de pedidos.
- Relatórios de quantidade de pedidos, unidades vendidas e total vendido. O módulo permite consultar um resumo por cliente; no menu, estão disponíveis relatórios gerais, por categoria e por produto.
- Menu interativo no terminal com operações de clientes, produtos, carrinhos, pedidos, estoque e relatórios.

## Estrutura do projeto

```text
src/
  types.ts       Tipos de cliente, produto, carrinho e pedido
  clientes.ts    Cadastro e consulta de clientes
  produtos.ts    Catálogo e regras de estoque
  carrinho.ts    Operações dos carrinhos e cálculos
  pedidos.ts     Finalização e consulta de pedidos
  relatorios.ts  Consolidação das vendas
  main.ts        Demonstração das funcionalidades
```

## Instalação e execução

### Requisitos e dependências

## 🚀 Como Executar o Projeto

Siga o passo a passo abaixo para configurar e executar a aplicação em sua máquina.

### 1. Inicializar o NPM

Caso ainda não tenha iniciado o gerenciador de pacotes no projeto, certifique-se de iniciar o NPM executando:

```bash
npm init -y
```

### 2. Instalar as Dependências

Instale (ou certifique-se de ter instalado) as seguintes bibliotecas principais do projeto:

* **typescript**: Compilador da linguagem TypeScript.
* **prompt-sync**: Biblioteca para capturar entradas de texto no terminal.

```bash
npm install typescript prompt-sync
```

### 3. Instalar as Tipagens (Desenvolvimento)

Instale a biblioteca de tipos para que o `prompt-sync` funcione corretamente e sem erros de compilação com o TypeScript:

```bash
npm install -D @types/prompt-sync
```

### 4. Executar a Aplicação

Para rodar o projeto diretamente sem precisar compilar manualmente os arquivos TypeScript, utilize o comando:

```bash
npx tsx ./src/main.ts
```

> 💡 **Nota:** Na primeira execução, o terminal pode perguntar se você deseja instalar temporariamente o pacote `tsx` (`Ok to proceed? (y)`). Basta pressionar **Enter** para aceitar e o programa iniciará em seguida.

## Regras de negócio

- IDs de produtos e clientes são inteiros positivos e únicos.
- Produtos precisam ter nome e categoria; preço deve ser maior que zero e estoque não pode ser negativo.
- Clientes precisam ter nome e e-mail; IDs e e-mails não podem se repetir.
- A quantidade no carrinho deve ser um inteiro positivo e não pode superar o estoque disponível. Adicionar novamente o mesmo produto soma a quantidade no item existente.
- Um pedido exige cliente cadastrado e carrinho com itens. O estoque é conferido antes da finalização e descontado somente quando o pedido é criado.
- O pedido guarda o nome e o preço unitário registrados na compra, sem ser afetado por alterações futuras no catálogo.

## Uso do menu

O menu principal oferece: 1) Clientes, 2) Produtos, 3) Pedidos, 4) Carrinho, 5) Estoque e 6) Relatórios de vendas. Cada seção apresenta suas operações disponíveis.

O menu permite cadastrar e consultar clientes e produtos, criar/consultar e editar carrinhos por ID ou nome do cliente, revisar os valores antes de finalizar pedidos, atualizar e consultar estoque e gerar relatórios gerais, por categoria ou por produto. Os dados ficam em memória e são reiniciados a cada execução.

## Limitações

- Não há persistência: clientes, produtos, carrinhos e pedidos existem apenas enquanto o programa está em execução.
- Não há interface gráfica, API, autenticação, pagamento, frete ou integração com banco de dados.
