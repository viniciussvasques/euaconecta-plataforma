-- Adicionar tabela Blog ao schema do Prisma
-- Este arquivo deve ser executado antes da migração dos dados

CREATE TABLE IF NOT EXISTS blog_posts (
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

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_is_featured ON blog_posts(is_featured);

-- Comentários para documentação
COMMENT ON TABLE blog_posts IS 'Tabela para armazenar posts do blog';
COMMENT ON COLUMN blog_posts.id IS 'Identificador único do post';
COMMENT ON COLUMN blog_posts.title IS 'Título do post';
COMMENT ON COLUMN blog_posts.slug IS 'URL amigável do post';
COMMENT ON COLUMN blog_posts.excerpt IS 'Resumo do post';
COMMENT ON COLUMN blog_posts.content IS 'Conteúdo completo do post';
COMMENT ON COLUMN blog_posts.author IS 'Autor do post';
COMMENT ON COLUMN blog_posts.category IS 'Categoria do post';
COMMENT ON COLUMN blog_posts.tags IS 'Tags do post';
COMMENT ON COLUMN blog_posts.featured_image IS 'Imagem destacada do post';
COMMENT ON COLUMN blog_posts.status IS 'Status do post (published, draft, archived)';
COMMENT ON COLUMN blog_posts.is_featured IS 'Se o post é destacado';
COMMENT ON COLUMN blog_posts.views IS 'Número de visualizações';
COMMENT ON COLUMN blog_posts.likes IS 'Número de curtidas';
COMMENT ON COLUMN blog_posts.created_at IS 'Data de criação';
COMMENT ON COLUMN blog_posts.updated_at IS 'Data de atualização';
