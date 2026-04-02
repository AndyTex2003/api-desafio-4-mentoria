# API Cavaleiros do Zodíaco

API RESTful em Node.js usando Express. Esta versão usa persistência simples em arquivo JSON (sem banco de dados), documentação Swagger e testes com Mocha/Chai/Supertest e relatórios com Mochawesome.

Principais mudanças/recursos

- Uso de variáveis de ambiente via `dotenv` (`.env`) — variáveis mínimas: `PORT` e `NODE_ENV`.
- Persistência simples em arquivo: `src/models/data/cavaleiros.json` (arquivo criado automaticamente e ignorado pelo git).
- Relatórios de teste com `mochawesome` gerando `reports/mochawesome.html` e `reports/mochawesome.json`.

Pré-requisitos

- Node.js >= 18

Instalação

```bash
npm install
```

Variáveis de ambiente

Crie um arquivo `.env` na raiz (exemplo já incluído):

```
PORT=3000
NODE_ENV=development
```

Rodar servidor

```bash
npm start
# ou em desenvolvimento (com nodemon)
npm run dev
```

Por padrão o servidor usa `process.env.PORT` (fallback 3000). A documentação Swagger fica disponível em `/api-docs`.

Abrir documentação Swagger

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

Executar testes e visualizar relatório

```bash
npm test
# após execução abra:
open reports/mochawesome.html    # macOS
xdg-open reports/mochawesome.html # Linux
# ou abra manualmente o arquivo HTML no Windows
```

Observações e recomendações

- A persistência em arquivo é adequada para desenvolvimento e demos. Para produção, use um banco de dados apropriado.
- As operações de leitura/escrita são síncronas por simplicidade e previsibilidade em testes. Se houver necessidades de desempenho ou concorrência, refatore para acesso assíncrono e controle de concorrência.
- Se quiser que eu adicione um endpoint para limpar o arquivo `cavaleiros.json` (útil para testes), eu posso implementar rapidamente.

Estrutura recomendada (resumida)

```
src/
	config/
	controllers/
	middlewares/
	models/
		data/cavaleiros.json
	routes/
	services/
	helpers/
tests/
	integration/
	unit/
	fixtures/
server.js
app.js
package.json
README.md
```

Se quiser, eu executo os testes agora e posto os resultados/trechos do relatório. Também posso adicionar um pequeno script para limpar a persistência entre execuções de teste se preferir.
