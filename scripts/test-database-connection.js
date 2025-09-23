// Teste de conexão com o banco de dados

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  try {
    console.log('Conectando ao banco de dados...');
    
    // Tentando buscar configurações da plataforma
    const config = await prisma.platform_config.findFirst();
    console.log('Configurações da plataforma:', config ? 'Encontradas' : 'Não encontradas');
    
    // Contando usuários
    const userCount = await prisma.users.count();
    console.log(`Total de usuários no sistema: ${userCount}`);
    
    // Buscando pacotes recentes
    const recentPackages = await prisma.packages.findMany({
      take: 5,
      orderBy: { created_at: 'desc' },
    });
    console.log(`Pacotes recentes encontrados: ${recentPackages.length}`);
    
    console.log('Conexão com banco de dados bem-sucedida!');
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();