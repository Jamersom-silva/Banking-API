#!/bin/bash

echo "🔧 Configurando ambiente de testes..."

# Instalar dependências
echo "📦 Instalando dependências de teste..."
npm install --save-dev jest ts-jest @types/jest supertest @types/supertest

# Criar arquivos de configuração
echo "⚙️  Criando configurações..."

# Criar .env.test se não existir
if [ ! -f ".env.test" ]; then
  echo "📝 Criando .env.test..."
  cat > .env.test << 'EOF'
NODE_ENV=test
PORT=3001
DATABASE_URL="file:./test.db"
JWT_SECRET=test_jwt_secret_for_testing_1234567890
JWT_REFRESH_SECRET=test_refresh_secret_for_testing_0987654321
ACCESS_TOKEN_EXPIRY=5m
REFRESH_TOKEN_EXPIRY=1d
BCRYPT_SALT_ROUNDS=4
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
LOGIN_RATE_LIMIT_MAX=10
LOGIN_RATE_LIMIT_WINDOW=60000
EOF
fi

# Criar estrutura de testes se não existir
echo "📁 Criando estrutura de testes..."
mkdir -p tests/integration tests/unit

# Criar setup.ts básico se não existir
if [ ! -f "tests/setup.ts" ]; then
  echo "📄 Criando tests/setup.ts..."
  cat > tests/setup.ts << 'EOF'
import dotenv from 'dotenv';

// Carregar variáveis de ambiente de teste
dotenv.config({ path: '.env.test' });

// Limpar mocks antes de cada teste
beforeEach(() => {
  jest.clearAllMocks();
});

// Configurações globais para testes
export const TEST_CONFIG = {
  user: {
    name: 'Test User',
    email: 'test@example.com',
    cpf: '111.222.333-44',
    password: 'Test@1234',
    birthDate: '1990-01-01',
  },
  account: {
    type: 'CHECKING' as const,
    initialBalance: 1000,
  },
};
EOF
fi

echo "✅ Configuração completa!"
echo ""
echo "📋 Comandos disponíveis:"
echo "  npm test              - Executar todos os testes"
echo "  npm run test:unit     - Executar testes unitários"
echo "  npm run test:integration - Executar testes de integração"
echo "  npm run test:coverage - Executar testes com coverage"
echo "  npm run test:watch    - Executar testes em modo watch"
echo ""
echo "🚀 Para criar seus primeiros testes, veja os exemplos fornecidos!"