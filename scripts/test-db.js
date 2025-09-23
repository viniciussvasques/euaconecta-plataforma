// Teste de conexão com o banco de dados usando JavaScript para evitar problemas de TypeScript

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  try {
    console.log('Conectando ao banco de dados...');
    
    // Verificando modelos disponíveis no cliente Prisma
    console.log('Modelos disponíveis no Prisma:');
    const prismaModels = Object.getOwnPropertyNames(prisma)
      .filter(prop => !prop.startsWith('_') && !prop.startsWith('$') && typeof prisma[prop] === 'object');
    console.log(prismaModels);
    
    // Verificando se temos o modelo "User" ou similar
    const userModel = prismaModels.find(model => 
      model.toLowerCase() === 'user' || 
      model.toLowerCase() === 'users'
    );
    
    if (userModel) {
      console.log(`\nUsando modelo: ${userModel}`);
      // Contando usuários
      const userCount = await prisma[userModel].count();
      console.log(`Total de usuários no sistema: ${userCount}`);
      
      if (userCount > 0) {
        // Buscando alguns usuários para exemplo
        const users = await prisma[userModel].findMany({
          take: 2,
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          }
        });
        console.log('Amostra de usuários:');
        console.log(JSON.stringify(users, null, 2));
      }
    } else {
      console.log('Modelo de usuário não encontrado');
    }
    
    console.log('\nConexão com banco de dados bem-sucedida!');
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
  } finally {
    await prisma.$disconnect();
    console.log('Desconectado do banco de dados');
  }
}

main();