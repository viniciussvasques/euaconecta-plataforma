#!/usr/bin/env node

const { execSync } = require('child_process')
const path = require('path')

console.log('🚀 Iniciando setup de deploy...')

try {
  // 1. Executar migrações do Prisma
  console.log('📦 Executando migrações do banco de dados...')
  execSync('npx prisma migrate deploy', { stdio: 'inherit' })
  
  // 2. Gerar cliente Prisma
  console.log('🔧 Gerando cliente Prisma...')
  execSync('npx prisma generate', { stdio: 'inherit' })
  
  // 3. Executar configuração padrão
  console.log('⚙️ Configurando sistema padrão...')
  execSync('node scripts/setup-default-config.js', { stdio: 'inherit' })
  
  console.log('✅ Setup de deploy concluído com sucesso!')
  
} catch (error) {
  console.error('❌ Erro durante o setup de deploy:', error.message)
  process.exit(1)
}
