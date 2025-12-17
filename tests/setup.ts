import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente de teste
dotenv.config({ path: '.env.test' });

// Banco de dados de teste
export const testPrisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL || 'file:./test.db',
    },
  },
});

// Limpar banco de dados antes de cada teste (SQLite)
export const cleanupDatabase = async (): Promise<void> => {
  const models = [
    'User',
    'Account', 
    'Transaction',
    'Token'
  ];

  try {
    // Desabilitar chaves estrangeiras (SQLite)
    await testPrisma.$executeRawUnsafe(`PRAGMA foreign_keys = OFF`);
    
    // Para cada modelo, deletar todos os registros
    for (const model of models) {
      try {
        await (testPrisma as any)[model.toLowerCase()].deleteMany({});
      } catch (error) {
        // Tabela pode não existir ainda
        console.log(`Tabela ${model} não existe ou erro ao limpar:`, error);
      }
    }
    
    // Reabilitar chaves estrangeiras
    await testPrisma.$executeRawUnsafe(`PRAGMA foreign_keys = ON`);
  } catch (error) {
    console.log('Erro ao limpar banco de dados:', error);
  }
};

// Dados de teste
export const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  cpf: '111.222.333-44',
  password: 'Test@1234',
  birthDate: '1990-01-01',
};

export const testAccount = {
  type: 'CHECKING' as const,
  initialBalance: 1000,
};