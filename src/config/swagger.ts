import { Options } from 'swagger-jsdoc';
import { env } from './env';

const swaggerOptions: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Banking API - Sistema Bancário',
      version: '1.0.0',
      description: `
        ## 🏦 API Bancária Completa
        
        Sistema bancário fake com todas as operações financeiras básicas:
        
        - ✅ **Autenticação** com JWT e refresh tokens
        - ✅ **Contas bancárias** (Corrente, Poupança, Salário)
        - ✅ **Operações**: Depósito, Saque, Transferência
        - ✅ **Extrato** com paginação
        - ✅ **Segurança**: Validação, Rate limiting, Hash de senhas
        
        ### 🔐 Autenticação
        Use \`Bearer <token>\` nos headers para endpoints protegidos.
        
        ### 📝 Status Codes
        - 200: Sucesso
        - 201: Criado
        - 400: Validação falhou
        - 401: Não autorizado
        - 404: Não encontrado
        - 409: Conflito (dados duplicados)
        - 500: Erro interno
        
        ### 🚀 Base URL
        \`${env.APP_URL}/api/v1\`
      `,
      contact: {
        name: 'Suporte Banking API',
        email: 'suporte@bankingapi.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: `${env.APP_URL}/api/v1`,
        description: env.NODE_ENV === 'production' ? 'Produção' : 'Desenvolvimento',
      },
    ],
    tags: [
      {
        name: '👤 Autenticação',
        description: 'Registro, login, refresh e logout de usuários',
      },
      {
        name: '🏦 Contas',
        description: 'Gerenciamento de contas bancárias',
      },
      {
        name: '💸 Operações',
        description: 'Depósitos, saques e transferências',
      },
      {
        name: '📊 Extrato',
        description: 'Consulta de histórico de transações',
      },
      {
        name: '🩺 Saúde',
        description: 'Verificação do status do sistema',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Insira o token JWT: `Bearer <seu_token_aqui>`',
        },
      },
      schemas: {
        // Schemas de autenticação
        UserRegister: {
          type: 'object',
          required: ['name', 'email', 'cpf', 'password', 'birthDate'],
          properties: {
            name: {
              type: 'string',
              minLength: 3,
              maxLength: 100,
              example: 'João Silva',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'joao@email.com',
            },
            cpf: {
              type: 'string',
              pattern: '^\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}$',
              example: '123.456.789-00',
            },
            password: {
              type: 'string',
              format: 'password',
              minLength: 8,
              example: 'Senha@123',
              description: 'Mínimo 8 caracteres, maiúscula, minúscula, número e especial',
            },
            birthDate: {
              type: 'string',
              format: 'date',
              example: '1990-01-01',
              description: 'Data no formato YYYY-MM-DD (maior de 18 anos)',
            },
          },
        },
        UserLogin: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'joao@email.com',
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'Senha@123',
            },
          },
        },
        AuthTokens: {
          type: 'object',
          properties: {
            accessToken: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
              description: 'Válido por 15 minutos',
            },
            refreshToken: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
              description: 'Válido por 7 dias',
            },
          },
        },
        RefreshToken: {
          type: 'object',
          required: ['refreshToken'],
          properties: {
            refreshToken: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
          },
        },
        
        // Schemas de conta
        CreateAccount: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: ['CHECKING', 'SAVINGS', 'SALARY'],
              example: 'CHECKING',
              default: 'CHECKING',
            },
            initialBalance: {
              type: 'number',
              minimum: 0,
              example: 1000.50,
              default: 0,
            },
          },
        },
        Account: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: '550e8400-e29b-41d4-a716-446655440000',
            },
            accountNumber: {
              type: 'string',
              example: 'clt7q3qgq0000q1qjq1q1q1q1',
            },
            agency: {
              type: 'string',
              example: '0001',
              default: '0001',
            },
            type: {
              type: 'string',
              example: 'CHECKING',
            },
            balance: {
              type: 'number',
              example: 1500.75,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-16T13:42:31.123Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-16T14:30:45.789Z',
            },
          },
        },
        
        // Schemas de operações
        Deposit: {
          type: 'object',
          required: ['amount'],
          properties: {
            amount: {
              type: 'number',
              minimum: 0.01,
              maximum: 1000000,
              example: 500.00,
              description: 'Valor máximo: R$ 1.000.000',
            },
            description: {
              type: 'string',
              maxLength: 200,
              example: 'Depósito via PIX',
            },
          },
        },
        Withdraw: {
          type: 'object',
          required: ['amount'],
          properties: {
            amount: {
              type: 'number',
              minimum: 0.01,
              maximum: 50000,
              example: 200.00,
              description: 'Valor máximo: R$ 50.000',
            },
          },
        },
        Transfer: {
          type: 'object',
          required: ['toAccountId', 'amount'],
          properties: {
            toAccountId: {
              type: 'string',
              format: 'uuid',
              example: '660e8400-e29b-41d4-a716-446655440000',
            },
            amount: {
              type: 'number',
              minimum: 0.01,
              maximum: 100000,
              example: 150.50,
              description: 'Valor máximo: R$ 100.000',
            },
            description: {
              type: 'string',
              maxLength: 200,
              example: 'Transferência para pagamento',
            },
          },
        },
        TransferResult: {
          type: 'object',
          properties: {
            transactionId: {
              type: 'string',
              format: 'uuid',
              example: '770e8400-e29b-41d4-a716-446655440000',
            },
            amount: {
              type: 'number',
              example: 150.50,
            },
            fromAccountId: {
              type: 'string',
              format: 'uuid',
            },
            toAccountId: {
              type: 'string',
              format: 'uuid',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        
        // Schema de transação/extrato
        Transaction: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            type: {
              type: 'string',
              enum: ['DEPOSIT', 'WITHDRAWAL', 'TRANSFER'],
              example: 'TRANSFER',
            },
            amount: {
              type: 'number',
              example: 150.50,
            },
            description: {
              type: 'string',
              example: 'Transferência entre contas',
            },
            status: {
              type: 'string',
              enum: ['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED'],
              example: 'COMPLETED',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            fromAccount: {
              type: 'object',
              properties: {
                accountNumber: {
                  type: 'string',
                },
                agency: {
                  type: 'string',
                },
              },
            },
            toAccount: {
              type: 'object',
              properties: {
                accountNumber: {
                  type: 'string',
                },
                agency: {
                  type: 'string',
                },
              },
            },
            isDebit: {
              type: 'boolean',
              example: true,
              description: 'True se a transação é débito (saída) da conta consultada',
            },
          },
        },
        
        // Paginação
        PaginatedStatement: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Transaction',
              },
            },
            meta: {
              type: 'object',
              properties: {
                total: {
                  type: 'integer',
                  example: 45,
                },
                page: {
                  type: 'integer',
                  example: 1,
                  minimum: 1,
                },
                limit: {
                  type: 'integer',
                  example: 10,
                  minimum: 1,
                  maximum: 100,
                },
                totalPages: {
                  type: 'integer',
                  example: 5,
                },
                hasNext: {
                  type: 'boolean',
                  example: true,
                },
                hasPrev: {
                  type: 'boolean',
                  example: false,
                },
              },
            },
          },
        },
        
        // Respostas padrão
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Operação realizada com sucesso',
            },
            data: {
              type: 'object',
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'string',
              example: 'Mensagem de erro',
            },
            details: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  path: {
                    type: 'string',
                    example: 'email',
                  },
                  message: {
                    type: 'string',
                    example: 'Email inválido',
                  },
                },
              },
            },
          },
        },
      },
      responses: {
        Unauthorized: {
          description: 'Token JWT ausente ou inválido',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
              example: {
                success: false,
                error: 'Não autorizado',
              },
            },
          },
        },
        ValidationError: {
          description: 'Erro de validação dos dados enviados',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
              example: {
                success: false,
                error: 'Validação falhou',
                details: [
                  {
                    path: 'email',
                    message: 'Email inválido',
                  },
                ],
              },
            },
          },
        },
        NotFound: {
          description: 'Recurso não encontrado',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
              example: {
                success: false,
                error: 'Conta não encontrada',
              },
            },
          },
        },
        Conflict: {
          description: 'Conflito de dados (ex: email já cadastrado)',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
              example: {
                success: false,
                error: 'Email já cadastrado',
              },
            },
          },
        },
        InsufficientBalance: {
          description: 'Saldo insuficiente para operação',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
              example: {
                success: false,
                error: 'Saldo insuficiente',
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    './src/routes/*.ts',
    './src/controllers/*.ts',
    './src/schemas/*.ts',
  ],
};

export default swaggerOptions;