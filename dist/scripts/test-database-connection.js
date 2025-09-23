"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});
async function main() {
    try {
        console.log('Conectando ao banco de dados...');
        try {
            const prismaMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(prisma)).filter((key) => !key.startsWith('$') && !key.startsWith('_'));
            console.log('Métodos disponíveis no Prisma:', prismaMethods);
            const configTable = prismaMethods.find((key) => key.includes('config') || key.includes('Config'));
            if (configTable && typeof prisma[configTable] === 'object') {
                const config = await prisma[configTable].findFirst();
                console.log(`Configurações da plataforma (${configTable}):`, config ? 'Encontradas' : 'Não encontradas');
            }
            else {
                console.log('Tabela de configurações não encontrada no schema');
            }
        }
        catch (error) {
            console.log('Erro ao buscar configurações:', error.message);
        }
        try {
            const tableNames = Object.getOwnPropertyNames(Object.getPrototypeOf(prisma)).filter((key) => !key.startsWith('$') && !key.startsWith('_'));
            console.log('Tabelas disponíveis:', tableNames);
        }
        catch (error) {
            console.log('Erro ao listar tabelas:', error.message);
        }
        try {
            if (prisma.user) {
                const userCount = await prisma.user.count();
                console.log(`Total de usuários no sistema: ${userCount}`);
                const users = await prisma.user.findMany({ take: 2 });
                console.log('Amostra de usuários:', JSON.stringify(users, null, 2));
            }
            else {
                const prismaMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(prisma)).filter((key) => !key.startsWith('$') && !key.startsWith('_'));
                const userTable = prismaMethods.find((key) => key.toLowerCase().includes('user') || key.toLowerCase().includes('usuario'));
                if (userTable) {
                    const userCount = await prisma[userTable].count();
                    console.log(`Total de usuários no sistema (${userTable}): ${userCount}`);
                    const users = await prisma[userTable].findMany({ take: 2 });
                    console.log(`Amostra de ${userTable}:`, JSON.stringify(users, null, 2));
                }
                else {
                    console.log('Tabela de usuários não encontrada no schema');
                }
            }
        }
        catch (error) {
            console.log('Erro ao buscar usuários:', error.message);
        }
        console.log('Conexão com banco de dados bem-sucedida!');
    }
    catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
    }
    finally {
        await prisma.$disconnect();
    }
}
main();
//# sourceMappingURL=test-database-connection.js.map