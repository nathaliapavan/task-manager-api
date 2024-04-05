# task-manager-api

API de gerenciamento de usuários e tarefas, com operações CRUD. Construída com arquitetura hexagonal

## Pré-requisitos

Certifique-se de ter os seguintes requisitos instalados antes de prosseguir:

- [Node.js](https://nodejs.org/) (v18.19.0) Ambiente de execução de Javascript do lado do servidor
- [NPM](https://www.npmjs.com/) Gerenciador de pacotes para o ambiente Node.js
- [Docker](https://www.docker.com/) Permite criar e executar contêineres
- [Docker Compose](https://docs.docker.com/compose/) Simplifica o processo de configuração e execução de aplicativos Docker, facilitando a definição de ambientes de desenvolvimento e produção de forma consistente

## Ferramentas
- [Express](https://expressjs.com/pt-br/) Framework utilizado para construir APIs
- [Typeorm](https://typeorm.io/) Uma ferramenta de ORM (Object-Relational Mapping) para Node.js e TypeScript, que permite trabalhar com bancos de dados relacionais usando objetos e classes
- [Jest](https://typeorm.io/) Utilizado na implementação de testes 
- [AWS-SDK-Client-SNS](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-client-sns/) Parte do AWS SDK para JavaScript versão 3, para a integração com o serviço SNS (Amazon Simple Notification Service)

## Instalação

1. Clone este repositório:

```bash
  git clone https://github.com/nathaliapavan/task-manager-api
```

2. Execução com NPM

```bash
  npm install
  npm run dev
```

3. Execução com Docker

```bash
  npm install
  docker-compose build
  docker-compose up -d
```

4. Acesse a API

   ```bash
     curl --location 'http://localhost:3000/ping'
   ```

   Você deverá receber:

   ```json
   { "message": "pong" }
   ```

5. Acesse a documentação Swagger em http://localhost:3000/docs

6. Banco de dados

Criar migration com typeorm

```bash
  npx typeorm migration:create src/infrastructure/database/migrations/YourMigrateName
```
