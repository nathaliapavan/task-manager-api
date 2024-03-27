# node-boilerplate

NodeJS + Express + Docker

Projeto contém documentação da API com Swagger, Eslint + Prettier para padronização do código

## Pré-requisitos

Certifique-se de ter os seguintes requisitos instalados antes de prosseguir:

- [Node.js](https://nodejs.org/) (v18.19.0) Ambiente de execução de Javascript do lado do servidor
- [NPM](https://www.npmjs.com/)  Gerenciador de pacotes para o ambiente Node.js 
- [Docker](https://www.docker.com/) Permite criar e executar contêineres
- [Docker Compose](https://docs.docker.com/compose/) Simplifica o processo de configuração e execução de aplicativos Docker, facilitando a definição de ambientes de desenvolvimento e produção de forma consistente

## Instalação

1. Clone este repositório:
  ```bash
    git clone https://github.com/nathaliapavan/node-boilerplate.git
  ```

2. Execução com NPM
  ```bash
    npm install
    npm run dev
  ```

3. Execução com Docker
  ```bash
    docker build -t tools-api .
    docker-compose up -d
  ```

4. Acesse a API
    ```bash
      curl --location 'http://localhost:3000/ping'
    ```

    Você deverá receber:
    ```json
      {"message":"pong"}
    ```

5. Acesse a documentação Swagger em http://localhost:3000/docs
