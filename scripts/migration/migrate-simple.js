const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

function log(message, color = 'white') {
  const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    white: '\x1b[37m'
  };
  console.log(`${colors[color]}${message}\x1b[0m`);
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
          logo: partner.logo,
          url: partner.website || partner.url || '',
          description: partner.description,
          category: partner.category || 'Geral',
          discount: partner.discount || '',
          rating: partner.rating || 5.0,
          isActive: partner.isActive || true,
          order: partner.order || 0
        },
        create: {
          id: partner.id,
          name: partner.name,
          logo: partner.logo,
          url: partner.website || partner.url || '',
          description: partner.description,
          category: partner.category || 'Geral',
          discount: partner.discount || '',
          rating: partner.rating || 5.0,
          isActive: partner.isActive || true,
          order: partner.order || 0
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
          description: tutorial.description || tutorial.title,
          type: tutorial.type || 'ARTICLE',
          duration: tutorial.duration || 5,
          difficulty: tutorial.difficulty || 'BEGINNER',
          videoUrl: tutorial.videoUrl || null,
          content: tutorial.content,
          order: tutorial.order || 0,
          isActive: tutorial.isActive || true
        },
        create: {
          id: tutorial.id,
          title: tutorial.title,
          description: tutorial.description || tutorial.title,
          type: tutorial.type || 'ARTICLE',
          duration: tutorial.duration || 5,
          difficulty: tutorial.difficulty || 'BEGINNER',
          videoUrl: tutorial.videoUrl || null,
          content: tutorial.content,
          order: tutorial.order || 0,
          isActive: tutorial.isActive || true
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

    await prisma.platformConfig.upsert({
      where: { id: 'default' },
      update: {
        companyName: configData.contact?.companyName || 'Euaconecta',
        addressLine1: configData.contact?.address || 'Orlando, FL',
        city: 'Orlando',
        state: 'FL',
        postalCode: '32801',
        country: 'United States',
        phone: configData.contact?.phone || '+1 (407) 952-3233',
        email: configData.contact?.email || 'contato@euaconecta.com',
        currency: 'USD',
        timezone: 'America/New_York',
        businessHours: JSON.stringify({
          monday: '9:00-18:00',
          tuesday: '9:00-18:00',
          wednesday: '9:00-18:00',
          thursday: '9:00-18:00',
          friday: '9:00-18:00',
          saturday: '10:00-16:00',
          sunday: 'closed'
        }),
        emailNotifications: true,
        smsNotifications: false,
        stripeEnabled: true,
        paypalEnabled: true,
        shipstationEnabled: true,
        s3Enabled: true,
        maxLoginAttempts: 5,
        sessionTimeout: 3600,
        require2FA: false,
        supportEmail: configData.contact?.email || 'contato@euaconecta.com',
        supportPhone: configData.contact?.phone || '+1 (407) 952-3233'
      },
      create: {
        id: 'default',
        companyName: configData.contact?.companyName || 'Euaconecta',
        addressLine1: configData.contact?.address || 'Orlando, FL',
        city: 'Orlando',
        state: 'FL',
        postalCode: '32801',
        country: 'United States',
        phone: configData.contact?.phone || '+1 (407) 952-3233',
        email: configData.contact?.email || 'contato@euaconecta.com',
        currency: 'USD',
        timezone: 'America/New_York',
        businessHours: JSON.stringify({
          monday: '9:00-18:00',
          tuesday: '9:00-18:00',
          wednesday: '9:00-18:00',
          thursday: '9:00-18:00',
          friday: '9:00-18:00',
          saturday: '10:00-16:00',
          sunday: 'closed'
        }),
        emailNotifications: true,
        smsNotifications: false,
        stripeEnabled: true,
        paypalEnabled: true,
        shipstationEnabled: true,
        s3Enabled: true,
        maxLoginAttempts: 5,
        sessionTimeout: 3600,
        require2FA: false,
        supportEmail: configData.contact?.email || 'contato@euaconecta.com',
        supportPhone: configData.contact?.phone || '+1 (407) 952-3233'
      }
    });

    log('✅ Platform Config migrado com sucesso!', 'green');
  } catch (error) {
    log(`❌ Erro ao migrar platform config: ${error.message}`, 'red');
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
    log('🚀 Iniciando migração de dados JSON para banco de dados...', 'blue');

    // Testar conexão
    await prisma.$connect();
    log('✅ Conexão com banco de dados estabelecida!', 'green');

    // Migrar dados
    await migratePartners();
    await migrateTutorials();
    await migratePlatformConfig();
    await migrateBlogPosts();

    log('\n🎉 Migração concluída com sucesso!', 'green');

  } catch (error) {
    log(`\n❌ Erro durante a migração: ${error.message}`, 'red');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
