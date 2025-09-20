# 📦 Scripts de Migração de Dados

Este diretório contém scripts para migrar dados dos arquivos JSON para o banco de dados PostgreSQL.

## 🎯 Objetivo

Migrar os seguintes dados:
- **blog.json** → Tabela `blog_posts`
- **partners.json** → Tabela `Partner`
- **tutorials.json** → Tabela `Tutorial`
- **customization.json** → Tabela `PlatformConfig`

## 📋 Pré-requisitos

1. **Banco de dados PostgreSQL** rodando
2. **Variável DATABASE_URL** configurada no `.env`
3. **Node.js** instalado
4. **Prisma** configurado

## 🚀 Como Executar

### 1. Executar Migração Completa

```bash
# Executar migração completa
./scripts/migration/run-migration.sh
```

### 2. Executar Apenas Schema (sem dados)

```bash
# Pular criação de schema
./scripts/migration/run-migration.sh --skip-schema
```

### 3. Verificar Migração

```bash
# Verificar se a migração foi bem-sucedida
node scripts/migration/verify-migration.js
```

### 4. Limpar Arquivos JSON

```bash
# Criar backup e remover arquivos JSON
./scripts/migration/cleanup-json-files.sh --backup

# Forçar remoção sem confirmação
./scripts/migration/cleanup-json-files.sh --force
```

## 📁 Arquivos

| Arquivo | Descrição |
|---------|-----------|
| `migrate-json-data.js` | Script principal de migração |
| `verify-migration.js` | Script de verificação |
| `add-blog-schema.sql` | SQL para criar tabela blog |
| `run-migration.sh` | Script shell para executar migração |
| `cleanup-json-files.sh` | Script para limpar arquivos JSON |
| `README.md` | Esta documentação |

## 🔧 Scripts Individuais

### migrate-json-data.js

```bash
# Executar migração
node scripts/migration/migrate-json-data.js
```

**Funcionalidades:**
- Migra partners do JSON para tabela `Partner`
- Migra tutorials do JSON para tabela `Tutorial`
- Migra configurações para tabela `PlatformConfig`
- Cria tabela `blog_posts` se não existir
- Migra posts do blog para tabela `blog_posts`

### verify-migration.js

```bash
# Verificar migração
node scripts/migration/verify-migration.js
```

**Funcionalidades:**
- Verifica se todos os dados foram migrados
- Compara contagens entre JSON e banco
- Gera relatório de verificação
- Mostra exemplos de dados migrados

## 📊 Estrutura dos Dados

### Blog Posts
```sql
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
```

### Partners
- Migra para tabela `Partner` existente
- Campos: id, name, description, logo, url, category, discount, rating, isActive, order

### Tutorials
- Migra para tabela `Tutorial` existente
- Campos: id, title, description, type, duration, difficulty, videoUrl, content, isActive, order

### Platform Config
- Migra para tabela `PlatformConfig` existente
- Campos: companyName, address, phone, email, website, currency, timezone, language, etc.

## ⚠️ Avisos Importantes

1. **Backup**: Sempre faça backup do banco antes de executar
2. **Teste**: Execute em ambiente de desenvolvimento primeiro
3. **Verificação**: Use o script de verificação após a migração
4. **Limpeza**: Só remova os arquivos JSON após confirmar que tudo funciona

## 🐛 Troubleshooting

### Erro de Conexão
```
❌ DATABASE_URL não está configurada
```
**Solução**: Configure a variável `DATABASE_URL` no arquivo `.env`

### Erro de Permissão
```
❌ psql não encontrado
```
**Solução**: Instale o PostgreSQL client ou execute o SQL manualmente

### Erro de Schema
```
❌ Tabela blog_posts não existe
```
**Solução**: Execute o SQL `add-blog-schema.sql` manualmente

## 📈 Próximos Passos

Após a migração bem-sucedida:

1. **Atualizar APIs** para usar banco de dados
2. **Testar funcionalidades** que usavam arquivos JSON
3. **Remover referências** aos arquivos JSON no código
4. **Otimizar queries** do banco de dados
5. **Implementar cache** para melhor performance

## 🔄 Rollback

Se precisar reverter a migração:

1. **Restaurar backup** do banco de dados
2. **Restaurar arquivos JSON** do backup (se criado)
3. **Reverter código** das APIs para usar arquivos JSON

## 📞 Suporte

Em caso de problemas:
1. Verifique os logs de erro
2. Execute o script de verificação
3. Consulte a documentação do Prisma
4. Verifique a conexão com o banco de dados
