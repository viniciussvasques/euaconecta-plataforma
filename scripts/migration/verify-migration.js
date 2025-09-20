#!/usr/bin/env node

/**
 * Script de Verificação da Migração
 *
 * Este script verifica se os dados foram migrados corretamente
 * para o banco de dados.
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Cores para output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function verifyPartners() {
  log('\n🔍 Verificando Partners...', 'blue');

  try {
    const partnersCount = await prisma.partner.count();
    const partnersData = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/partners.json'), 'utf8'));

    if (partnersCount === partnersData.length) {
      log(`✅ Partners: ${partnersCount}/${partnersData.length} migrados`, 'green');
    } else {
      log(`❌ Partners: ${partnersCount}/${partnersData.length} migrados`, 'red');
    }

    // Verificar alguns dados específicos
    const samplePartner = await prisma.partner.findFirst();
    if (samplePartner) {
      log(`  📋 Exemplo: ${samplePartner.name} (${samplePartner.category})`, 'cyan');
    }

    return partnersCount === partnersData.length;
  } catch (error) {
    log(`❌ Erro ao verificar partners: ${error.message}`, 'red');
    return false;
  }
}

async function verifyTutorials() {
  log('\n🔍 Verificando Tutorials...', 'blue');

  try {
    const tutorialsCount = await prisma.tutorial.count();
    const tutorialsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/tutorials.json'), 'utf8'));

    if (tutorialsCount === tutorialsData.length) {
      log(`✅ Tutorials: ${tutorialsCount}/${tutorialsData.length} migrados`, 'green');
    } else {
      log(`❌ Tutorials: ${tutorialsCount}/${tutorialsData.length} migrados`, 'red');
    }

    // Verificar alguns dados específicos
    const sampleTutorial = await prisma.tutorial.findFirst();
    if (sampleTutorial) {
      log(`  📋 Exemplo: ${sampleTutorial.title} (${sampleTutorial.difficulty})`, 'cyan');
    }

    return tutorialsCount === tutorialsData.length;
  } catch (error) {
    log(`❌ Erro ao verificar tutorials: ${error.message}`, 'red');
    return false;
  }
}

async function verifyPlatformConfig() {
  log('\n🔍 Verificando Platform Config...', 'blue');

  try {
    const config = await prisma.platformConfig.findUnique({
      where: { id: 'default' }
    });

    if (config) {
      log(`✅ Platform Config: Migrado`, 'green');
      log(`  📋 Empresa: ${config.companyName}`, 'cyan');
      log(`  📋 Email: ${config.email}`, 'cyan');
      log(`  📋 Telefone: ${config.phone}`, 'cyan');
      return true;
    } else {
      log(`❌ Platform Config: Não encontrado`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Erro ao verificar platform config: ${error.message}`, 'red');
    return false;
  }
}

async function verifyBlogPosts() {
  log('\n🔍 Verificando Blog Posts...', 'blue');

  try {
    const blogCount = await prisma.$queryRaw`SELECT COUNT(*) as count FROM blog_posts`;
    const blogData = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/blog.json'), 'utf8'));

    if (blogCount[0].count === blogData.length) {
      log(`✅ Blog Posts: ${blogCount[0].count}/${blogData.length} migrados`, 'green');
    } else {
      log(`❌ Blog Posts: ${blogCount[0].count}/${blogData.length} migrados`, 'red');
    }

    // Verificar alguns dados específicos
    const samplePost = await prisma.$queryRaw`SELECT title, author, status FROM blog_posts LIMIT 1`;
    if (samplePost.length > 0) {
      log(`  📋 Exemplo: ${samplePost[0].title} por ${samplePost[0].author}`, 'cyan');
    }

    return blogCount[0].count === blogData.length;
  } catch (error) {
    log(`❌ Erro ao verificar blog posts: ${error.message}`, 'red');
    return false;
  }
}

async function generateReport() {
  log('\n📊 Gerando relatório de verificação...', 'blue');

  try {
    const report = {
      timestamp: new Date().toISOString(),
      partners: await prisma.partner.count(),
      tutorials: await prisma.tutorial.count(),
      platformConfig: await prisma.platformConfig.count(),
      blogPosts: (await prisma.$queryRaw`SELECT COUNT(*) as count FROM blog_posts`)[0].count
    };

    const reportPath = path.join(__dirname, '../../migration-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    log(`✅ Relatório salvo em: ${reportPath}`, 'green');
    log(`📋 Resumo:`, 'cyan');
    log(`  - Partners: ${report.partners}`, 'green');
    log(`  - Tutorials: ${report.tutorials}`, 'green');
    log(`  - Platform Config: ${report.platformConfig}`, 'green');
    log(`  - Blog Posts: ${report.blogPosts}`, 'green');

  } catch (error) {
    log(`❌ Erro ao gerar relatório: ${error.message}`, 'red');
  }
}

async function main() {
  try {
    log('🔍 Iniciando verificação da migração...', 'bright');

    // Verificar conexão com banco
    await prisma.$connect();
    log('✅ Conexão com banco de dados estabelecida!', 'green');

    // Executar verificações
    const partnersOk = await verifyPartners();
    const tutorialsOk = await verifyTutorials();
    const configOk = await verifyPlatformConfig();
    const blogOk = await verifyBlogPosts();

    // Gerar relatório
    await generateReport();

    // Resultado final
    const allOk = partnersOk && tutorialsOk && configOk && blogOk;

    if (allOk) {
      log('\n🎉 Todas as verificações passaram!', 'green');
      log('✅ Migração foi bem-sucedida!', 'green');
    } else {
      log('\n❌ Algumas verificações falharam!', 'red');
      log('⚠️  Verifique os dados no banco de dados', 'yellow');
    }

  } catch (error) {
    log(`\n❌ Erro durante a verificação: ${error.message}`, 'red');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = {
  verifyPartners,
  verifyTutorials,
  verifyPlatformConfig,
  verifyBlogPosts,
  generateReport
};
