# Back-End para Autenticações 📃

Esse é um back-end responsável por criar registros de usuários usando um nome de usuário e uma senha e criação de tarefas para Todo-List.

## Parte técnica 👩‍💻

### Banco de Dados

O banco de dados desse projeto é o mongoDB.

### .env

Nesse projeto é utilizado um arquivo .env com informações sigilosas, as variáveis são:

``````env
DB_USER=NOME_DO_USUARIO_DO_DB
DB_PASSWORD=SENHA_DO_DB
SECRET=SECRET_DO_JWT
``````

### Dependências

Para poder instalar as dependências do projeto basta usar um gerenciador de pacotes, no exemplo abaixo usei o npm:

`````` terminal
npm install
``````

Vale lembra que se você possuir outro gerenciador de pacotes o comando será diferente.
