# API Cavaleiros do Zodíaco (em memória)

Projeto de exemplo: API RESTful em Node.js usando Express, armazenamento em memória, documentação Swagger e testes com Mocha/Chai/Supertest.

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
# ou em desenvolvimento
npm run dev
```

## Abrir documentação Swagger

Acesse: http://localhost:3000/api-docs

## Executar testes

```bash
npm test
```

## Observações

- Implementa validações estritas conforme especificado no desafio (campos obrigatórios, enums, regras de cosmo, armadura divina, status MORTO e validação de data de nascimento).
- Armazenamento é em memória: reiniciar o servidor limpa os dados.
