// debug-customization.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  try {
    const CONFIG_KEY = 'system_customization';
    console.log('Verificando registros na tabela system_customization...');
    
    const records = await prisma.systemCustomization.findMany();
    console.log('Registros encontrados:', records.length);
    
    for (const record of records) {
      console.log('Chave:', record.key);
    }

    const configRecord = await prisma.systemCustomization.findUnique({
      where: { key: CONFIG_KEY }
    });
    
    if (configRecord) {
      console.log('Registro encontrado com chave', CONFIG_KEY);
      console.log('Valor atual (parcial):', JSON.stringify(configRecord.value).substring(0, 100) + '...');
      
      // Força a atualização do registro
      await prisma.systemCustomization.update({
        where: { key: CONFIG_KEY },
        data: {
          updatedAt: new Date()
        }
      });
      
      console.log('Registro atualizado com sucesso');
    } else {
      console.log('Nenhum registro encontrado com chave', CONFIG_KEY);
    }
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

run();