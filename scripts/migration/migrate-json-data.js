#!/usr/bin/env node

/**
 * Script de Migração de Dados JSON para Banco de Dados
 *
 * Este script migra os dados dos arquivos JSON para as tabelas do banco de dados:
 * - blog.json -> Blog posts (nova tabela)
 * - partners.json -> Partner
 * - tutorials.json -> Tutorial
 * - customization.json -> PlatformConfig
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

async function migratePartners() {
  log('\n🔄 Migrando Partners...', 'blue');

  try {
    const partnersData = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/partners.json'), 'utf8'));

    for (const partner of partnersData) {
      await prisma.partner.upsert({
        where: { id: partner.id },
        update: {
          name: partner.name,
          description: partner.description,
          logo: partner.logo,
          url: partner.link,
          category: partner.category,
          discount: partner.discount || '',
          rating: partner.rating || 5.0,
          isActive: partner.isActive,
          order: partner.order
        },
        create: {
          id: partner.id,
          name: partner.name,
          description: partner.description,
          logo: partner.logo,
          url: partner.link,
          category: partner.category,
          discount: partner.discount || '',
          rating: partner.rating || 5.0,
          isActive: partner.isActive,
          order: partner.order
        }
      });
    }

    log(`✅ ${partnersData.length} partners migrados com sucesso!`, 'green');
  } catch (error) {
    log(`❌ Erro ao migrar partners: ${error.message}`, 'red');
    throw error;
  }
}

async function migrateTutorials() {
  log('\n🔄 Migrando Tutorials...', 'blue');

  try {
    const tutorialsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/tutorials.json'), 'utf8'));

    for (const tutorial of tutorialsData) {
      await prisma.tutorial.upsert({
        where: { id: tutorial.id },
        update: {
          title: tutorial.title,
          description: tutorial.description,
          type: tutorial.type.toUpperCase(),
          duration: tutorial.duration,
          difficulty: tutorial.difficulty.toUpperCase(),
          videoUrl: tutorial.videoUrl || tutorial.url,
          content: tutorial.content,
          isActive: tutorial.isActive,
          order: tutorial.order
        },
        create: {
          id: tutorial.id,
          title: tutorial.title,
          description: tutorial.description,
          type: tutorial.type.toUpperCase(),
          duration: tutorial.duration,
          difficulty: tutorial.difficulty.toUpperCase(),
          videoUrl: tutorial.videoUrl || tutorial.url,
          content: tutorial.content,
          isActive: tutorial.isActive,
          order: tutorial.order
        }
      });
    }

    log(`✅ ${tutorialsData.length} tutorials migrados com sucesso!`, 'green');
  } catch (error) {
    log(`❌ Erro ao migrar tutorials: ${error.message}`, 'red');
    throw error;
  }
}

async function migratePlatformConfig() {
  log('\n🔄 Migrando Platform Config...', 'blue');

  try {
    const configData = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/customization.json'), 'utf8'));

    // Migrar configurações básicas
    await prisma.platformConfig.upsert({
      where: { id: 'default' },
      update: {
        companyName: configData.contact?.companyName || 'Euaconecta',
        addressLine1: configData.contact?.address || 'Orlando, FL',
        city: 'Orlando',
        state: 'FL',
        country: 'United States',
        zipCode: '32801',
        phone: configData.contact?.phone || '+1 (407) 952-3233',
        email: configData.contact?.email || 'contato@euaconecta.com',
        website: configData.contact?.website || 'https://euaconecta.com',
        currency: 'USD',
        timezone: 'America/New_York',
        language: 'pt-BR',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24h',
        businessHours: JSON.stringify({
          monday: '9:00-18:00',
          tuesday: '9:00-18:00',
          wednesday: '9:00-18:00',
          thursday: '9:00-18:00',
          friday: '9:00-18:00',
          saturday: '10:00-16:00',
          sunday: 'closed'
        }),
        socialMedia: JSON.stringify(configData.socialMedia || {}),
        features: JSON.stringify({
          consolidation: true,
          tracking: true,
          insurance: true,
          repackaging: true
        }),
        notifications: JSON.stringify({
          email: true,
          sms: false,
          push: true
        }),
        maintenance: JSON.stringify({
          enabled: false,
          message: 'Sistema em manutenção. Voltamos em breve!',
          startTime: null,
          endTime: null
        }),
        security: JSON.stringify({
          twoFactor: false,
          sessionTimeout: 30,
          maxLoginAttempts: 5
        }),
        integrations: JSON.stringify({
          stripe: true,
          paypal: true,
          shipstation: true
        }),
        customization: JSON.stringify(configData.branding || {}),
        landingPage: JSON.stringify(configData.landingPage || {}),
        isActive: true
      },
      create: {
        id: 'default',
        companyName: configData.contact?.companyName || 'Euaconecta',
        addressLine1: configData.contact?.address || 'Orlando, FL',
        city: 'Orlando',
        state: 'FL',
        country: 'United States',
        zipCode: '32801',
        phone: configData.contact?.phone || '+1 (407) 952-3233',
        email: configData.contact?.email || 'contato@euaconecta.com',
        website: configData.contact?.website || 'https://euaconecta.com',
        currency: 'USD',
        timezone: 'America/New_York',
        language: 'pt-BR',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24h',
        businessHours: JSON.stringify({
          monday: '9:00-18:00',
          tuesday: '9:00-18:00',
          wednesday: '9:00-18:00',
          thursday: '9:00-18:00',
          friday: '9:00-18:00',
          saturday: '10:00-16:00',
          sunday: 'closed'
        }),
        socialMedia: JSON.stringify(configData.socialMedia || {}),
        features: JSON.stringify({
          consolidation: true,
          tracking: true,
          insurance: true,
          repackaging: true
        }),
        notifications: JSON.stringify({
          email: true,
          sms: false,
          push: true
        }),
        maintenance: JSON.stringify({
          enabled: false,
          message: 'Sistema em manutenção. Voltamos em breve!',
          startTime: null,
          endTime: null
        }),
        security: JSON.stringify({
          twoFactor: false,
          sessionTimeout: 30,
          maxLoginAttempts: 5
        }),
        integrations: JSON.stringify({
          stripe: true,
          paypal: true,
          shipstation: true
        }),
        customization: JSON.stringify(configData.branding || {}),
        landingPage: JSON.stringify(configData.landingPage || {}),
        isActive: true
      }
    });

    log('✅ Platform Config migrado com sucesso!', 'green');
  } catch (error) {
    log(`❌ Erro ao migrar platform config: ${error.message}`, 'red');
    throw error;
  }
}

async function createBlogTable() {
  log('\n🔄 Criando tabela Blog...', 'blue');

  try {
    // Verificar se a tabela já existe
    const existingTable = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'blog_posts'
      );
    `;

    if (existingTable[0].exists) {
      log('✅ Tabela Blog já existe!', 'green');
      return;
    }

    // Criar tabela Blog
    await prisma.$executeRaw`
      CREATE TABLE blog_posts (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        excerpt TEXT,
        content TEXT NOT NULL,
        author VARCHAR(255) NOT NULL,
        category VARCHAR(255),
        tags TEXT[],
        featured_image VARCHAR(255),
        status VARCHAR(50) DEFAULT 'published',
        is_featured BOOLEAN DEFAULT false,
        views INTEGER DEFAULT 0,
        likes INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    log('✅ Tabela Blog criada com sucesso!', 'green');
  } catch (error) {
    log(`❌ Erro ao criar tabela Blog: ${error.message}`, 'red');
    throw error;
  }
}

async function migrateBlogPosts() {
  log('\n🔄 Migrando Blog Posts...', 'blue');

  try {
    const blogData = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/blog.json'), 'utf8'));

    for (const post of blogData) {
      await prisma.$executeRaw`
        INSERT INTO blog_posts (
          id, title, slug, excerpt, content, author, category, tags,
          featured_image, status, is_featured, views, likes, created_at, updated_at
        ) VALUES (
          ${post.id}, ${post.title}, ${post.slug}, ${post.excerpt}, ${post.content}, ${post.author}, ${post.category}, ${post.tags},
          ${post.featuredImage}, ${post.status}, ${post.isFeatured}, ${post.views}, ${post.likes}, ${new Date(post.createdAt || Date.now())}, ${new Date(post.updatedAt || Date.now())}
        ) ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          slug = EXCLUDED.slug,
          excerpt = EXCLUDED.excerpt,
          content = EXCLUDED.content,
          author = EXCLUDED.author,
          category = EXCLUDED.category,
          tags = EXCLUDED.tags,
          featured_image = EXCLUDED.featured_image,
          status = EXCLUDED.status,
          is_featured = EXCLUDED.is_featured,
          views = EXCLUDED.views,
          likes = EXCLUDED.likes,
          updated_at = EXCLUDED.updated_at
      `;
    }

    log(`✅ ${blogData.length} blog posts migrados com sucesso!`, 'green');
  } catch (error) {
    log(`❌ Erro ao migrar blog posts: ${error.message}`, 'red');
    throw error;
  }
}

async function main() {
  try {
    log('🚀 Iniciando migração de dados JSON para banco de dados...', 'bright');

    // Verificar conexão com banco
    await prisma.$connect();
    log('✅ Conexão com banco de dados estabelecida!', 'green');

    // Executar migrações
    await createBlogTable();
    await migratePartners();
    await migrateTutorials();
    await migratePlatformConfig();
    await migrateBlogPosts();

    log('\n🎉 Migração concluída com sucesso!', 'green');
    log('📊 Resumo:', 'cyan');
    log('  - Partners: Migrados', 'green');
    log('  - Tutorials: Migrados', 'green');
    log('  - Platform Config: Migrado', 'green');
    log('  - Blog Posts: Migrados', 'green');

  } catch (error) {
    log(`\n❌ Erro durante a migração: ${error.message}`, 'red');
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
  migratePartners,
  migrateTutorials,
  migratePlatformConfig,
  migrateBlogPosts,
  createBlogTable
};
