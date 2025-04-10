# Access Billing API (Green Acesso)

API para gerenciamento de boletos do condomínio, desenvolvida com NestJS.

## 🚀 Funcionalidades

- Importação de boletos via CSV
- Importação de boletos via PDF
- Listagem de boletos com filtros
- Geração de relatórios em PDF

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- Docker e Docker Compose
- PostgreSQL (será executado via Docker)

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/DeyvisonTav/access-billing.git
cd access-billing   
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```
Edite o arquivo `.env` com suas configurações.

4. Inicie o banco de dados PostgreSQL com Docker Compose:
```bash
docker-compose up -d
```

5. Execute as migrações do banco de dados:
```bash
npm run migration:run
# ou
yarn migration:run
```

## 🏃‍♂️ Executando o Projeto

### Desenvolvimento
```bash
# Inicie o banco de dados (se ainda não estiver rodando)
docker-compose up -d

# Execute a aplicação
npm run start:dev
# ou
yarn start:dev
```

### Produção
```bash
# Inicie o banco de dados (se ainda não estiver rodando)
docker-compose up -d

# Execute a aplicação
npm run build
npm run start:prod
# ou
yarn build
yarn start:prod
```

### Parando o Projeto
```bash
# Parar a aplicação
Ctrl+C

# Parar o banco de dados
docker-compose down
```

## 📚 Documentação da API

A documentação da API está disponível em `http://localhost:3000/api` quando o servidor estiver rodando em ambiente de desenvolvimento.

### Endpoints

#### Importar Boletos via CSV
```http
POST /bills/import/csv
Content-Type: multipart/form-data

file: arquivo.csv
```

#### Importar Boletos via PDF
```http
POST /bills/import/pdf
Content-Type: multipart/form-data

file: arquivo.pdf
```

#### Listar Boletos
```http
GET /bills?nome_sacado=João&valor_inicial=1000&valor_final=2000&id_lote=1&relatorio=true
```

### Parâmetros de Filtro

| Parâmetro     | Tipo    | Descrição                          | Exemplo     |
|---------------|---------|------------------------------------|-------------|
| nome_sacado   | string  | Nome do sacado para filtrar        | João Silva  |
| valor_inicial | number  | Valor mínimo do boleto             | 1000        |
| valor_final   | number  | Valor máximo do boleto             | 2000        |
| id_lote       | number  | ID do lote para filtrar            | 1           |
| relatorio     | boolean | Gerar relatório em PDF             | true        |

## 🛠️ Tecnologias Utilizadas

- [NestJS](https://nestjs.com/) - Framework Node.js
- [TypeORM](https://typeorm.io/) - ORM para PostgreSQL
- [Swagger](https://swagger.io/) - Documentação da API
- [PDFKit](https://pdfkit.org/) - Geração de PDFs
- [Multer](https://github.com/expressjs/multer) - Upload de arquivos
- [Jest](https://jestjs.io/) - Testes unitários
- [Docker](https://www.docker.com/) - Containerização
- [Docker Compose](https://docs.docker.com/compose/) - Orquestração de containers

## 📁 Estrutura do Projeto

```
src/
├── config/              # Configurações da aplicação
├── core/               # Configurações e módulos core da aplicação
├── migrations/         # Migrações do banco de dados
├── modules/            # Módulos da aplicação
│   └── bills/         # Módulo de boletos
│       ├── controllers/  # Controladores da API
│       ├── services/     # Lógica de negócio
│       ├── repositories/ # Repositórios para acesso ao banco
│       ├── entities/     # Entidades do banco de dados
│       ├── dtos/         # Data Transfer Objects
│       └── bills.module.ts # Módulo de boletos
├── shared/            # Recursos compartilhados
├── test/              # Testes da aplicação
├── app.module.ts      # Módulo principal
└── main.ts           # Ponto de entrada da aplicação
```

## 🧪 Testes

```bash
# Certifique-se que o banco de dados está rodando
docker-compose up -d

# Executar testes
npm run test
# ou
yarn test

# Executar testes com cobertura
npm run test:cov
# ou
yarn test:cov
```

## 📦 Docker

O projeto utiliza Docker Compose para gerenciar o banco de dados PostgreSQL. Para executar o projeto completo:

```bash
# Iniciar o banco de dados
docker-compose up -d

# Executar as migrações
npm run migration:run

# Iniciar a aplicação
npm run start:dev
```

Para parar todos os serviços:
```bash
docker-compose down
```

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para suporte, envie um email para deyvisontav@gmail.com ou abra uma issue no [GitHub](https://github.com/DeyvisonTav/access-billing).

## 👨‍💻 Para Recrutadores

### Testando a API

A API está disponível para testes através do Postman. Você pode importar a coleção usando o link abaixo:

[![Run in Postman](https://run.pstmn.io/button.svg)](https://deyvisontav.postman.co/workspace/Team-Workspace~dd7e4a7a-0641-4ef8-8a50-b2a23116c3ec/collection/23629418-baf0997e-2da5-412c-a0e2-a5c37f018fdf?action=share&creator=23629418)

### Arquivos de Exemplo

Os arquivos de exemplo estão disponíveis na pasta `files` do projeto:

1. **Arquivo CSV para Importação**
   - [Download boletos.csv](https://raw.githubusercontent.com/DeyvisonTav/access-billing/develop/files/boletos.csv)
   - Formato esperado:
     ```csv
     nome;unidade;valor;linha_digitavel
     JOSE DA SILVA;17;182.54;123456123456123456
     MARCOS ROBERTO;18;178.20;123456123456123456
     MARCIA CARVALHO;19;128.00;123456123456123456
     ```

2. **Arquivo PDF para Importação**
   - [Download boletos.pdf](https://raw.githubusercontent.com/DeyvisonTav/access-billing/develop/files/boletos.pdf)
   - O PDF contém múltiplos boletos que serão processados individualmente

### Exemplos de Uso com Curl

#### 1. Importar Boletos via CSV
```bash
curl -X POST http://localhost:3000/bills/import/csv \
  -H "Content-Type: multipart/form-data" \
  -F "file=@files/boletos.csv"
```

#### 2. Importar Boletos via PDF
```bash
curl -X POST http://localhost:3000/bills/import/pdf \
  -H "Content-Type: multipart/form-data" \
  -F "file=@files/boletos.pdf"
```

#### 3. Listar Boletos com Filtros

##### 3.1 Listar todos os boletos
```bash
curl "http://localhost:3000/bills"
```

##### 3.2 Filtrar por nome do sacado
```bash
curl "http://localhost:3000/bills?nome_sacado=JOSE"
```

##### 3.3 Filtrar por faixa de valor
```bash
curl "http://localhost:3000/bills?valor_inicial=100"
```

##### 3.4 Filtrar por ID do lote
```bash
curl "http://localhost:3000/bills?id_lote=1"
```

##### 3.5 Gerar relatório em PDF
```bash
curl "http://localhost:3000/bills?relatorio=true"
```

##### 3.6 Combinar filtros
```bash
curl "http://localhost:3000/bills?nome_sacado=JOSE&valor_inicial=100&valor_final=20&0id_lote=1"
```

### Observações Importantes

- A API está configurada para rodar localmente na porta 3000
- O banco de dados PostgreSQL é necessário (pode ser iniciado via Docker Compose)
- As migrações do banco de dados devem ser executadas antes de usar a API
- A documentação completa da API está disponível em `http://localhost:3000/api`
- Os arquivos de exemplo estão disponíveis na pasta `files` do projeto
- Para testar os endpoints de importação, certifique-se de que os arquivos de exemplo estão no diretório correto
