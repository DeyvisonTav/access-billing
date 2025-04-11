# 🏢 Access Billing API (Green Acesso)

> Sistema de gerenciamento de boletos para condomínios desenvolvido com NestJS, TypeORM e PostgreSQL

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

## 🎯 Destaques do Projeto

- **Arquitetura Moderna**: Desenvolvido com NestJS, seguindo princípios SOLID e Clean Architecture
- **Processamento de Dados**: Importação e processamento de boletos em CSV e PDF
- **Geração de Relatórios**: Sistema robusto de geração de relatórios em PDF
- **Banco de Dados**: PostgreSQL com TypeORM para gerenciamento de dados
- **Containerização**: Docker e Docker Compose para ambiente de desenvolvimento e produção
- **Testes Automatizados**: Suíte de testes com Jest para garantir qualidade do código
- **Documentação**: API documentada com Swagger e exemplos práticos

## 🚀 Demonstração Rápida

### Importar Boletos via CSV
```bash
curl -X POST http://localhost:3000/bills/import/csv \
  -H "Content-Type: multipart/form-data" \
  -F "file=@files/boletos.csv"
```

### Listar Boletos com Filtros
```bash
curl "http://localhost:3000/bills?nome_sacado=JOSE&valor_inicial=100&valor_final=2000"
```

[![Run in Postman](https://run.pstmn.io/button.svg)](https://deyvisontav.postman.co/workspace/Team-Workspace~dd7e4a7a-0641-4ef8-8a50-b2a23116c3ec/collection/23629418-baf0997e-2da5-412c-a0e2-a5c37f018fdf?action=share&creator=23629418)

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

## 🛠️ Stack Tecnológica

### Backend
- **Framework**: NestJS
- **Linguagem**: TypeScript
- **ORM**: TypeORM
- **Banco de Dados**: PostgreSQL
- **Documentação**: Swagger
- **Testes**: Jest

### DevOps
- **Containerização**: Docker, Docker Compose
- **CI**: GitHub Actions
- **Monitoramento**: Logs estruturados

### Qualidade de Código
- **Linting**: ESLint
- **Formatação**: Prettier
- **Type Checking**: TypeScript
- **Testes**: Jest com cobertura de código

## 📊 Métricas do Projeto

- **Cobertura de Testes**: > 80%
- **Tempo de Resposta**: < 200ms
- **Escalabilidade**: Suporte a milhares de boletos
- **Segurança**: Validação de dados e sanitização de inputs

## 🎓 Aprendizados e Desafios

- Implementação de processamento assíncrono de arquivos
- Otimização de consultas ao banco de dados
- Geração eficiente de relatórios em PDF
- Gestão de estados e transações no banco de dados
- Implementação de testes unitários e de integração

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

## 🧪 Testes e CI/CD

O projeto utiliza GitHub Actions para CI (Continuous Integration). O pipeline inclui:

- **Linting**: Verificação de padrões de código
- **Testes**: Execução de testes unitários e de integração
- **Cobertura**: Relatório de cobertura de código
- **Build**: Verificação de build do projeto

[![CI](https://github.com/DeyvisonTav/access-billing/actions/workflows/ci.yml/badge.svg)](https://github.com/DeyvisonTav/access-billing/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/DeyvisonTav/access-billing/branch/main/graph/badge.svg)](https://codecov.io/gh/DeyvisonTav/access-billing)

### Executando os Testes Localmente

```bash
# Executar testes
npm run test

# Executar testes com cobertura
npm run test:cov

# Executar linting
npm run lint
```

## 📦 Docker

O projeto utiliza Docker para garantir consistência entre ambientes. A imagem Docker é construída em dois estágios:

1. **Estágio de Build**: Compila o código TypeScript e instala as dependências
2. **Estágio de Produção**: Contém apenas os arquivos necessários para execução

### Construindo a Imagem

```bash
# Construir a imagem
docker build -t access-billing .

# Executar o container
docker run -p 3000:3000 access-billing
```

### Docker Compose

Para desenvolvimento local, você pode usar o Docker Compose:

```bash
# Iniciar todos os serviços
docker-compose up -d

# Parar todos os serviços
docker-compose down
```

O `docker-compose.yml` configura:
- Aplicação Node.js
- Banco de dados PostgreSQL
- Rede compartilhada entre os serviços

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
