# projeto-labook-backend

O Labook é uma rede social com o objetivo de promover a conexão e interação entre pessoas. Quem se cadastrar no aplicativo poderá criar e curtir publicações.


# Lista de requisitos

- Documentação Postman de todos os endpoints (obrigatória para correção)

- Endpoints

  - [ ] signup
  - [ ] login
  - [ ] create post
  - [ ] get posts
  - [ ] edit post
  - [ ] delete post
  - [ ] like / dislike post

- Autenticação e autorização

  - [ ] identificação UUID
  - [ ] senhas hasheadas com Bcrypt
  - [ ] tokens JWT

- Código

  - [ ] POO
  - [ ] Arquitetura em camadas
  - [ ] Roteadores no Express

- README.md


## Link da Documentação

https://documenter.getpostman.com/view/28316405/2s9YeLXozM



## :rocket: Tecnologias

As seguintes ferramentas foram usadas na construção do projeto:

- [Node.js](https://nodejs.org/en/)
- [Expres JS](https://expressjs.com/pt-br/)
- [TypeScript](https://www.typescriptlang.org/)

- [Knex](https://knexjs.org/)
- [Bcrypt.js](https://github.com/kelektiv/node.bcrypt.js#readme)
- [Sqlite](https://www.sqlite.org/index.html)


## Pré requisitos

Antes de começar:, você precisa ter o [Git](https://git-scm.com) e o [Node](https://nodejs.org/en/) instalados em sua maquina.


## Instruções de instalação

1. Clone o repositório.
2. No gerenciador de pacotes NPM, execute:

```sh
npm i
```

3. Na pasta `database`, crie um arquivo `file-name.db`.
4. Abra o arquivo `labook.sql` e execute os comandos de criação de tabela.
5. Crie um arquivo chamado `.env` na raiz do projeto para colocar essas variáveis ​​de ambiente.

```sh

#Porto Expresso
PORTA=3003
#Caminho do arquivo do banco de dados SQLite
DB_FILE_PATH=./src/database/nome-do-arquivo.db
#Credenciais e chaves secretas
JWT_KEY=escolheu uma chave secreta
#Tempo de expiração do token (exemplo: 1 dia)
JWT_EXPIRES_IN=1d
```

6. Execute o servidor.

```sh
npm run dev
```

Feito por <a href="https://github.com/Cristian91Assuncao" target="_blank">Cristian Assunção</a>