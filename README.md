# API Cavaleiros do Zodíaco

API RESTful em Node.js usando Express. Esta versão usa persistência simples em arquivo JSON (sem banco de dados), documentação Swagger e testes com Mocha/Chai/Supertest e relatórios com Mochawesome.

Principais mudanças/recursos

- Uso de variáveis de ambiente via `dotenv` (`.env`) — variáveis mínimas: `PORT` e `NODE_ENV`.
- Persistência simples em arquivo: `src/models/data/cavaleiros.json` (arquivo criado automaticamente e ignorado pelo git).
- Relatórios de teste com `mochawesome` gerando `reports/mochawesome.html` e `reports/mochawesome.json`.

## Pré-requisitos

- Node.js >= 18

## Instalação

```bash
npm install
```

## Configuração do Ambiente

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```
PORT=3000
```

Você pode alterar o valor da porta se desejar rodar o servidor em outra porta.

## Rodar servidor

```bash
npm start
# ou em desenvolvimento (com nodemon)
npm run dev
```

## Abrir documentação Swagger

Após iniciar o servidor, abra:

```
http://localhost:3000/api-docs
```

Persistência de dados

- Os cavaleiros são salvos em `src/models/data/cavaleiros.json` através do model (`src/models/cavaleirosModel.js`).
- O arquivo é criado automaticamente se não existir e é mantido fora do controle de versão (configurado em `.gitignore`).
- Para limpar os dados em desenvolvimento, você pode remover o conteúdo do arquivo ou executar scripts de teste que chamam o model `clear()`.

Scripts úteis

- `npm start` — inicia a aplicação
- `npm run dev` — inicia com `nodemon`
- `npm test` — executa os testes com Mocha e gera relatório Mochawesome em `reports/` (HTML + JSON)

## Executar testes

```bash
npm test
# após execução abra:
open reports/mochawesome.html    # macOS
xdg-open reports/mochawesome.html # Linux
# ou abra manualmente o arquivo HTML no Windows
```

## Observações

Se quiser, eu executo os testes agora e posto os resultados/trechos do relatório. Também posso adicionar um pequeno script para limpar a persistência entre execuções de teste se preferir.
