#!/bin/sh
set -e

echo "Aplicando migrations do banco de dados..."
npx prisma migrate deploy

echo "Iniciando a API..."
exec node dist/main.js
