# Access Billing - Sistema de Gerenciamento de Boletos (Green Acesso)

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## Descrição

Sistema de gerenciamento de boletos para condomínios, desenvolvido com NestJS. O sistema permite a importação de boletos via arquivo CSV, gerenciamento de lotes, geração de relatórios em PDF e distribuição de boletos individuais.

## Funcionalidades

- 🏢 Gerenciamento de Lotes
- 📄 Importação de Boletos via CSV
- 📊 Geração de Relatórios em PDF
- 📦 Distribuição Automática de Boletos
- 🔍 Filtros Avançados de Busca
- 🛡️ Validação de Dados
- 🧪 Testes Automatizados

## Requisitos

- Node.js (v16 ou superior)
- Docker e Docker Compose
- PostgreSQL

## Configuração do Ambiente

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/access-billing.git
cd access-billing
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Inicie o banco de dados com Docker:
```bash
docker-compose up -d
```

5. Execute as migrações:
```bash
npm run migration:run
```

## Estrutura do Projeto

```
src/
├── modules/
│   └── bills/
│       ├── controllers/
│       ├── services/
│       ├── repositories/
│       ├── entities/
│       └── dtos/
├── migrations/
├── shared/
│   ├── interfaces/
│   ├── providers/
│   └── utils/
└── config/
```

## Endpoints

### Boletos

- `POST /bills/import/csv` - Importa boletos via arquivo CSV
- `POST /bills/pdf` - Processa PDF com múltiplos boletos
- `GET /bills` - Lista boletos com filtros
  - Parâmetros:
    - `nome`: Filtro por nome do sacado
    - `valor_inicial`: Valor mínimo
    - `valor_final`: Valor máximo
    - `id_lote`: ID do lote
    - `relatorio`: 1 para gerar relatório em PDF

## Banco de Dados

### Tabelas

#### Lotes
```sql
CREATE TABLE lotes (
    id INT NOT NULL PRIMARY KEY,
    nome VARCHAR(100),
    ativo BOOLEAN,
    criado_em TIMESTAMP
);
```

#### Boletos
```sql
CREATE TABLE boletos (
    id INT NOT NULL PRIMARY KEY,
    nome_sacado VARCHAR(255),
    id_lote INT NOT NULL,
    valor DECIMAL,
    linha_digitavel VARCHAR(255),
    ativo BOOLEAN,
    criado_em TIMESTAMP,
    FOREIGN KEY (id_lote) REFERENCES lotes(id)
);
```

## Executando o Projeto

### Desenvolvimento
```bash
npm run start:dev
```

### Produção
```bash
npm run build
npm run start:prod
```

### Testes
```bash
# Testes unitários e integração
npm run test:watch

# Cobertura de testes
npm run test:cov
```

## Variáveis de Ambiente

```env
# Database
POSTGRES_USER=docker
POSTGRES_PASSWORD=docker
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=access-billing

# Server
PORT=3000

# Node
NODE_ENV=development
```

## Docker

O projeto utiliza Docker para o banco de dados PostgreSQL. O arquivo `docker-compose.yml` configura:

- PostgreSQL com volume persistente
- Credenciais padrão (pode ser alterado no .env)
- Porta 5432 exposta

Para iniciar:
```bash
docker-compose up -d
```

Para parar:
```bash
docker-compose down
```

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## Suporte

Para suporte, envie um email para seu-email@exemplo.com ou abra uma issue no GitHub.
