import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'user@test.com';

  const userExists = await prisma.user.findUnique({
    where: { email },
  });

  if (userExists) {
    console.log('⚠️ Usuário de teste já existe');
    return;
  }

  const passwordHash = await bcrypt.hash('123456', 10);

  const user = await prisma.user.create({
    data: {
      name: 'Usuário Teste',
      email,
      password: passwordHash,

      // 🔥 CAMPOS OBRIGATÓRIOS DO SEU DOMÍNIO
      cpf: '12345678900',
      birthDate: new Date('1995-01-01'),

      // 🏦 Conta bancária inicial
      accounts: {
        create: {
          balance: 1000,
        },
      },
    },
  });

  console.log('✅ Usuário de teste criado com sucesso');
  console.log('📧 Email:', user.email);
  console.log('🔑 Senha: 123456');
}

main()
  .catch((error) => {
    console.error('❌ Erro ao executar seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
