#!/bin/bash

# Configurações do banco de dados
DB_NAME="access-billing-test"
DB_USER="docker"
DB_PASSWORD="docker"
DB_HOST="localhost"
DB_PORT="5432"

# Cria o banco de dados de teste
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c "DROP DATABASE IF EXISTS \"$DB_NAME\";"
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c "CREATE DATABASE \"$DB_NAME\";"

echo "Banco de dados de teste configurado com sucesso!" 