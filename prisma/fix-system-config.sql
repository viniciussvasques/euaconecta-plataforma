-- Inserir ou atualizar configurações do sistema
INSERT INTO "SystemCustomization" (id, "createdAt", "updatedAt", key, value, description, "isActive", version)
VALUES (
  'system_config_fix',
  NOW(),
  NOW(),
  'system_config',
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
        "title": "Receba seus produtos dos EUA no Brasil",
        "subtitle": "Consolidação de pacotes, envio seguro e rastreamento em tempo real",
        "ctaText": "Começar Agora",
        "ctaLink": "/auth/register"
      },
      "features": [
        {
          "icon": "package",
          "title": "Consolidação Inteligente",
          "description": "Combine múltiplos pacotes em uma única remessa"
        },
        {
          "icon": "shield",
          "title": "Seguro e Confiável",
          "description": "Proteção total para seus produtos"
        },
        {
          "icon": "truck",
          "title": "Rastreamento em Tempo Real",
          "description": "Acompanhe sua encomenda a cada etapa"
        }
      ],
      "testimonials": [],
      "pricing": {
        "enabled": false,
        "plans": []
      }
    },
    "contact": {
      "phone": "+55 (11) 99999-9999",
      "email": "contato@euaconecta.com",
      "address": "São Paulo, SP - Brasil"
    },
    "socialMedia": {
      "whatsapp": "https://wa.me/5511999999999",
      "facebook": "https://facebook.com/euaconecta",
      "instagram": "https://instagram.com/euaconecta"
    }
  }',
  'Configurações gerais do sistema',
  true,
  1
)
ON CONFLICT (key)
DO UPDATE SET
  value = "SystemCustomization".value || 
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
          "title": "Receba seus produtos dos EUA no Brasil",
          "subtitle": "Consolidação de pacotes, envio seguro e rastreamento em tempo real",
          "ctaText": "Começar Agora",
          "ctaLink": "/auth/register"
        },
        "features": [
          {
            "icon": "package",
            "title": "Consolidação Inteligente",
            "description": "Combine múltiplos pacotes em uma única remessa"
          },
          {
            "icon": "shield",
            "title": "Seguro e Confiável",
            "description": "Proteção total para seus produtos"
          },
          {
            "icon": "truck",
            "title": "Rastreamento em Tempo Real",
            "description": "Acompanhe sua encomenda a cada etapa"
          }
        ]
      },
      "contact": {
        "phone": "+55 (11) 99999-9999",
        "email": "contato@euaconecta.com",
        "address": "São Paulo, SP - Brasil"
      },
      "socialMedia": {
        "whatsapp": "https://wa.me/5511999999999",
        "facebook": "https://facebook.com/euaconecta",
        "instagram": "https://instagram.com/euaconecta"
      }
    }'
  ),
  version = "SystemCustomization".version + 1,
  "updatedAt" = NOW()
WHERE "SystemCustomization".key = 'system_config';