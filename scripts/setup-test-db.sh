export POSTGRES_USER="postgres"
export POSTGRES_PASSWORD="postgres"
export POSTGRES_DB="access-billing"
export POSTGRES_HOST="localhost"
export POSTGRES_PORT="5432"

echo "Aguardando PostgreSQL estar pronto..."
while ! PGPASSWORD=$POSTGRES_PASSWORD pg_isready -h localhost -p 5432 -U postgres; do
  echo "PostgreSQL ainda não está pronto, aguardando..."
  sleep 2
done

echo "Criando banco de dados de teste..."
PGPASSWORD=$POSTGRES_PASSWORD psql -h localhost -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = '$POSTGRES_DB'" | grep -q 1 || PGPASSWORD=$POSTGRES_PASSWORD psql -h localhost -U postgres -c "CREATE DATABASE \"$POSTGRES_DB\""

echo "Verificando se o banco foi criado..."
PGPASSWORD=$POSTGRES_PASSWORD psql -h localhost -U postgres -d $POSTGRES_DB -c "SELECT 1" || exit 1

echo "Configurando permissões do banco de dados..."
PGPASSWORD=$POSTGRES_PASSWORD psql -h localhost -U postgres -d $POSTGRES_DB -c "GRANT ALL PRIVILEGES ON DATABASE \"$POSTGRES_DB\" TO postgres;"

echo "Executando migrações..."
npm run migration:run

echo "Setup do banco de dados concluído!" 