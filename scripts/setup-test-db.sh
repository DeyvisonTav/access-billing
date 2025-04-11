#!/bin/bash

# Configuração do banco de dados de teste
export POSTGRES_USER="postgres"
export POSTGRES_PASSWORD="postgres"
export POSTGRES_DB="access-billing-test"
export POSTGRES_HOST="localhost"
export POSTGRES_PORT="5432"

# Aguarda o PostgreSQL estar pronto
echo "Aguardando PostgreSQL estar pronto..."
while ! pg_isready -h localhost -p 5432 -U postgres; do
  sleep 1
done

# Cria o banco de dados de teste se não existir
echo "Criando banco de dados de teste..."
psql -h localhost -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = 'access-billing-test'" | grep -q 1 || psql -h localhost -U postgres -c "CREATE DATABASE \"access-billing-test\""

# Executa as migrações
echo "Executando migrações..."
npm run migration:run

echo "Setup do banco de dados concluído!" 