# 🏦 Banking API - Sistema Bancário Fake

[![Node.js](https://img.shields.io/badge/Node.js-20+-green)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.x-black)](https://www.prisma.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

API bancária completa para simular operações bancárias com foco em **segurança, boas práticas e documentação**. Ideal para estudos, portfólio ou como base para projetos financeiros.

## ✨ Funcionalidades

### 🔐 Autenticação & Segurança
- ✅ Registro de usuários com validação robusta (Zod)
- ✅ Login com JWT + Refresh tokens
- ✅ Blacklist de tokens inválidos
- ✅ Rate limiting em endpoints sensíveis
- ✅ Hash de senhas com bcrypt
- ✅ Middleware de autenticação JWT

### 🏦 Operações Bancárias
- ✅ Criação de contas (Corrente, Poupança, Salário)
- ✅ Depósitos e Saques com validação de saldo
- ✅ Transferências entre contas
- ✅ Extrato bancário com paginação
- ✅ Consulta de saldo e detalhes da conta
- ✅ Listagem de todas as contas do usuário

### 🛡️ Segurança & Validação
- ✅ Validação de input com Zod schemas
- ✅ Tratamento centralizado de erros
- ✅ Transações atômicas no banco de dados
- ✅ Verificação de propriedade de recursos
- ✅ Headers de segurança (Helmet.js)
- ✅ CORS configurado

### 📚 Documentação & Qualidade
- ✅ Documentação Swagger/OpenAPI interativa
- ✅ Testes automatizados com Jest
- ✅ TypeScript com tipagem estrita
- ✅ ESLint + Prettier configurados
- ✅ Health checks e monitoramento

## 🚀 Começando

### Pré-requisitos
- Node.js 18 ou superior
- npm ou yarn
- SQLite (para desenvolvimento)
- Git

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/banking-api.git
cd banking-api
Instale as dependências

bash
npm install
Configure as variáveis de ambiente

bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
Execute as migrations do banco de dados

bash
npx prisma migrate dev --name init
Popule o banco com dados de exemplo (opcional)

bash
npm run prisma:seed
Inicie o servidor

bash
# Desenvolvimento (hot reload)
npm run dev

# Produção
npm run build
npm start
📡 Endpoints da API
👤 Autenticação
Método	Endpoint	Descrição	Autenticação
POST	/api/v1/auth/register	Registrar novo usuário	❌
POST	/api/v1/auth/login	Fazer login	❌
POST	/api/v1/auth/refresh	Renovar tokens	❌
POST	/api/v1/auth/logout	Sair do sistema	✅
🏦 Contas Bancárias
Método	Endpoint	Descrição	Autenticação
POST	/api/v1/accounts	Criar nova conta	✅
GET	/api/v1/accounts	Listar contas do usuário	✅
GET	/api/v1/accounts/:id	Detalhes da conta	✅
💸 Operações
Método	Endpoint	Descrição	Autenticação
POST	/api/v1/accounts/:id/deposit	Realizar depósito	✅
POST	/api/v1/accounts/:id/withdraw	Realizar saque	✅
POST	/api/v1/accounts/:id/transfer	Transferir para outra conta	✅
📊 Extrato
Método	Endpoint	Descrição	Autenticação
GET	/api/v1/accounts/:id/statement	Obter extrato com paginação	✅
🩺 Saúde
Método	Endpoint	Descrição	Autenticação
GET	/api/v1/health	Health check do sistema	❌
GET	/api/v1/health/version	Versão da API	❌
📚 Documentação Interativa
Acesse a documentação Swagger UI em:
http://localhost:3000/api/v1/docs

https://img.shields.io/badge/Documenta%C3%A7%C3%A3o-Interativa-brightgreen

🧪 Testes
bash
# Executar todos os testes
npm test

# Testes com cobertura
npm run test:coverage

# Testes de integração
npm run test:integration

# Testes unitários
npm run test:unit

# Modo watch (desenvolvimento)
npm run test:watch
Estrutura de Testes
text
tests/
├── integration/     # Testes de endpoints da API
├── unit/           # Testes de serviços e utilitários
└── setup.ts        # Configuração comum
🛠️ Scripts Disponíveis
bash
# Desenvolvimento
npm run dev          # Inicia servidor com hot reload

# Build
npm run build        # Compila TypeScript
npm start            # Inicia produção

# Banco de Dados
npx prisma studio    # Interface gráfica do banco
npx prisma migrate   # Executa migrations
npm run prisma:seed  # Popula dados de exemplo

# Qualidade de Código
npm run lint         # Verifica estilo de código
npm run lint:fix     # Corrige problemas de estilo
npm run format       # Formata código com Prettier

# Testes
npm test             # Executa todos os testes
npm run test:watch   # Executa testes em modo watch
🏗️ Estrutura do Projeto
text
banking-api/
├── src/
│   ├── config/          # Configurações (env, database)
│   ├── controllers/     # Controladores da API
│   ├── services/        # Lógica de negócio
│   ├── middlewares/     # Auth, validation, error handling
│   ├── routes/         # Definição de rotas
│   ├── schemas/        # Validação Zod
│   ├── utils/          # Helpers e utilitários
│   ├── types/          # Tipos TypeScript
│   └── index.ts        # Ponto de entrada
├── prisma/
│   ├── schema.prisma   # Schema do banco de dados
│   └── migrations/     # Migrations do Prisma
├── tests/
│   ├── integration/    # Testes de integração
│   ├── unit/          # Testes unitários
│   └── setup.ts       # Configuração de testes
├── docs/              # Documentação adicional
└── scripts/           # Scripts auxiliares
🔧 Tecnologias Utilizadas
Runtime: Node.js

Language: TypeScript

Framework: Express.js

ORM: Prisma

Database: SQLite (dev) / PostgreSQL (prod)

Validation: Zod

Authentication: JWT, bcrypt

Testing: Jest, Supertest

Documentation: Swagger/OpenAPI

Code Quality: ESLint, Prettier

Security: Helmet, express-rate-limit

🔐 Segurança Implementada
Validação de input com Zod schemas

Hash de senhas com bcrypt (12 rounds)

Tokens JWT com expiração (15m access, 7d refresh)

Refresh tokens com blacklist

Rate limiting em endpoints de login

Headers de segurança com Helmet.js

CORS configurado

Transações atômicas no banco de dados

Verificação de propriedade de recursos

Logging estruturado de atividades sensíveis

📊 Exemplos de Uso
1. Registrar Usuário
bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "cpf": "123.456.789-00",
    "password": "Senha@123",
    "birthDate": "1990-01-01"
  }'
2. Fazer Login
bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "password": "Senha@123"
  }'
3. Criar Conta Bancária
bash
curl -X POST http://localhost:3000/api/v1/accounts \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "CHECKING",
    "initialBalance": 1000.00
  }'
4. Realizar Transferência
bash
curl -X POST http://localhost:3000/api/v1/accounts/1/transfer \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "toAccountId": "550e8400-e29b-41d4-a716-446655440000",
    "amount": 150.50,
    "description": "Pagamento de serviços"
  }'
🚢 Deploy
Opções Recomendadas:
Render (Mais fácil) - Guia de Deploy

Railway (Com PostgreSQL incluído) - Guia de Deploy

Heroku (Tradicional) - Guia de Deploy

Variáveis de Ambiente para Produção:
env
NODE_ENV=production
PORT=3000
DATABASE_URL="postgresql://user:password@localhost:5432/banking"
JWT_SECRET=seu_super_segredo_minimo_32_caracteres
JWT_REFRESH_SECRET=outro_super_segredo_minimo_32_caracteres
🤝 Contribuindo
Fork o projeto

Crie uma branch para sua feature (git checkout -b feature/AmazingFeature)

Commit suas mudanças (git commit -m 'Add some AmazingFeature')

Push para a branch (git push origin feature/AmazingFeature)

Abra um Pull Request

📄 Licença
Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

👥 Autores
Seu Nome - @seu-usuario

🙏 Agradecimentos
Prisma - ORM incrível

Zod - Validação de schemas

Express - Framework web minimalista

TypeScript - JavaScript com tipagem




## 📁 **Arquivos adicionais que você pode criar:**

### **LICENSE** (MIT License):


MIT License

Copyright (c) 2025 jAMERSOM SILVA

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.