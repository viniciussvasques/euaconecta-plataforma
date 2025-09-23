# Correção de Duplicidade nas Configurações Administrativas

## Problema Identificado

Foi identificada duplicidade na gestão das configurações da plataforma, especificamente:

1. **Configurações da Empresa/Contato** - Aparece em duas seções diferentes:
   - `/admin/platform-config` - Configuração da plataforma (nome, endereço, email, telefone)
   - `/admin/settings/customization` (aba Contato) - Mesmas informações

2. **Endereço da Empresa** - Aparece em múltiplos lugares:
   - Configuração da plataforma
   - Customização (dados de contato)

Essa duplicidade causa confusão e pode levar a inconsistências nos dados, pois as alterações em uma seção não são refletidas automaticamente na outra.

## Solução Proposta

### 1. Centralizar as Configurações

Criar um único ponto de verdade para cada tipo de configuração:

| Tipo de Configuração | Local Centralizado | Descrição |
|----------------------|-------------------|-----------|
| **Dados da Empresa** | `/admin/platform-config` | Informações básicas da empresa (nome, endereço, contato) |
| **Personalização** | `/admin/settings/customization` | Personalização visual (cores, logos, textos) |
| **Integrações** | `/admin/settings/integrations` | Conexões com serviços externos |

### 2. Refatorar o Componente de Customização

Remover os campos duplicados do componente de customização e substituir por uma referência aos dados da plataforma:

1. Remover os campos de contato da seção de customização
2. Adicionar uma nota indicando que esses dados são gerenciados em Configuração da Plataforma
3. Se necessário, criar visualizadores somente leitura para exibir os dados da plataforma

### 3. Implementar Sincronização de Dados

Para garantir consistência durante a transição:

1. Criar um script de migração que sincronize os dados existentes
2. Implementar um mecanismo para manter os dados sincronizados até que a refatoração seja concluída

### 4. Atualizar Documentação e UI

1. Atualizar a interface para direcionar os usuários ao local correto de cada configuração
2. Adicionar tooltips e mensagens de ajuda informando onde cada tipo de informação deve ser gerenciada
3. Atualizar a documentação do sistema refletindo a nova organização

## Mapa de Configurações Após Refatoração

- **Configuração da Plataforma** (`/admin/platform-config`)
  - Informações da Empresa (nome, endereço, telefone, email)
  - Configurações de Negócio (taxas, prazos, valores padrão)
  - Configurações Técnicas (limites, timeouts, flags de recursos)

- **Personalização** (`/admin/settings/customization`)
  - Landing Page (textos, imagens, seções)
  - Cores e Temas (esquema de cores, fontes)
  - Redes Sociais (links para plataformas)

- **Email/Notificações** (`/admin/email-config`)
  - Templates de Email
  - Configurações de Envio
  - Gatilhos de Notificação

## Próximos Passos

1. Revisar a estrutura dos modelos de dados que suportam essas configurações
2. Implementar as mudanças no front-end sem perder dados existentes
3. Atualizar as APIs relacionadas para buscar os dados do local correto
4. Adicionar validações para garantir consistência dos dados