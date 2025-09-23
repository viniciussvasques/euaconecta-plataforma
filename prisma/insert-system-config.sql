-- Inserir configuração do sistema
INSERT INTO system_customization (id, key, value, description, is_active, version, created_at, updated_at)
VALUES 
  (
    'cln01x3em0000pssj58xtd5xz', -- ID único
    'system_config', -- Chave que identifica a configuração do sistema
    '{
      "branding": {
        "logo": {
          "primary": "/logo-euaconecta.png",
          "favicon": "/favicon.ico"
        },
        "colors": {
          "primary": "#3b82f6",
          "secondary": "#22c55e", 
          "accent": "#f59e0b"
        },
        "fonts": {
          "primary": "Inter"
        }
      },
      "landingPage": {
        "hero": {
          "title": "Compre nos EUA e receba no Brasil",
          "subtitle": "Endereço nos EUA, consolidação de pacotes e envio seguro para o Brasil",
          "backgroundImage": "/hero-bg.jpg",
          "ctaText": "Comece Agora",
          "ctaLink": "/auth/register"
        },
        "features": [
          {
            "icon": "package",
            "title": "Endereço nos EUA",
            "description": "Receba suas encomendas no nosso depósito nos Estados Unidos"
          },
          {
            "icon": "box",
            "title": "Consolidação Inteligente",
            "description": "Economize combinando vários pacotes em um único envio"
          },
          {
            "icon": "shield",
            "title": "Proteção Total",
            "description": "Embalagem reforçada e seguro para seus produtos"
          },
          {
            "icon": "truck",
            "title": "Frete Internacional",
            "description": "Envio rápido e rastreável para o Brasil"
          }
        ],
        "testimonials": [
          {
            "name": "Ana Silva",
            "role": "Cliente desde 2024",
            "content": "Serviço incrível! Consegui economizar mais de 40% nas minhas compras internacionais.",
            "avatar": "/avatars/ana.svg"
          },
          {
            "name": "Carlos Oliveira",
            "role": "Cliente desde 2023",
            "content": "A consolidação de pacotes funciona perfeitamente. O atendimento é excelente!",
            "avatar": "/avatars/carlos.svg"
          }
        ],
        "pricing": {
          "enabled": true,
          "plans": [
            {
              "name": "Básico",
              "price": "Grátis",
              "features": [
                "Endereço nos EUA",
                "Armazenamento por 15 dias",
                "Fotos do pacote",
                "Suporte por email"
              ]
            },
            {
              "name": "Premium",
              "price": "$9.99/mês",
              "popular": true,
              "features": [
                "Todos os recursos do Básico",
                "Armazenamento por 30 dias",
                "Consolidação ilimitada",
                "Proteção premium",
                "Suporte prioritário"
              ]
            }
          ]
        }
      }
    }',
    'Configuração principal do sistema', -- Descrição
    true, -- Ativo
    1, -- Versão
    NOW(), -- Criado em
    NOW() -- Atualizado em
  )
ON CONFLICT (key) 
DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = NOW(),
  version = system_customization.version + 1;