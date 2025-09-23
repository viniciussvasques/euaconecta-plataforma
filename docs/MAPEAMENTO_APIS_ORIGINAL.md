# Mapeamento de APIs - Projeto Original EuaConecta

## Estrutura de APIs do Projeto Original

Abaixo está um mapeamento detalhado de todas as APIs identificadas no projeto original, organizadas por domínio.

## 1. Autenticação e Usuários (`/api/auth/`)

### Endpoints de Autenticação
- **POST /api/auth/login** - Autenticação de usuários
- **POST /api/auth/register** - Registro de novos usuários
- **GET /api/auth/me** - Obter dados do usuário autenticado
- **POST /api/auth/logout** - Encerrar sessão do usuário
- **POST /api/auth/refresh** - Renovar token de acesso
- **POST /api/auth/forgot-password** - Solicitar recuperação de senha
- **POST /api/auth/reset-password** - Redefinir senha
- **POST /api/auth/activate** - Ativar conta de usuário
- **POST /api/auth/resend-activation** - Reenviar email de ativação

### Endpoints de Usuários
- **GET /api/users** - Listar usuários
- **GET /api/users/[id]** - Obter usuário específico
- **PUT /api/users/[id]** - Atualizar dados do usuário
- **DELETE /api/users/[id]** - Desativar/remover usuário
- **GET /api/users/[id]/packages** - Listar pacotes do usuário
- **GET /api/users/[id]/payments** - Listar pagamentos do usuário
- **GET /api/users/[id]/shipments** - Listar envios do usuário

## 2. Pacotes (`/api/packages/`)

### Gerenciamento de Pacotes
- **GET /api/packages** - Listar pacotes (filtros: userId, status)
- **POST /api/packages** - Criar novo pacote
- **GET /api/packages/[id]** - Obter pacote específico
- **PUT /api/packages/[id]** - Atualizar informações do pacote
- **DELETE /api/packages/[id]** - Remover pacote
- **PUT /api/packages/[id]/status** - Atualizar status do pacote
- **GET /api/packages/stats** - Obter estatísticas de pacotes

## 3. Envios (`/api/shipments/`)

### Gerenciamento de Envios
- **GET /api/shipments** - Listar envios (filtros: userId, status)
- **POST /api/shipments** - Criar novo envio
- **GET /api/shipments/[id]** - Obter envio específico
- **PUT /api/shipments/[id]** - Atualizar informações do envio
- **DELETE /api/shipments/[id]** - Cancelar envio
- **PUT /api/shipments/[id]/status** - Atualizar status do envio
- **GET /api/shipments/[id]/tracking** - Obter informações de rastreamento
- **GET /api/shipments/stats** - Obter estatísticas de envios

## 4. Consolidação (`/api/consolidation/`)

### Gerenciamento de Consolidação
- **GET /api/consolidation** - Listar consolidações
- **POST /api/consolidation** - Criar nova consolidação
- **GET /api/consolidation/[id]** - Obter consolidação específica
- **PUT /api/consolidation/[id]** - Atualizar consolidação
- **DELETE /api/consolidation/[id]** - Remover consolidação
- **PUT /api/consolidation/[id]/add-package** - Adicionar pacote à consolidação
- **PUT /api/consolidation/[id]/remove-package** - Remover pacote da consolidação
- **PUT /api/consolidation/[id]/status** - Atualizar status da consolidação

## 5. Pagamentos (`/api/payments/`)

### Gerenciamento de Pagamentos
- **GET /api/payments** - Listar pagamentos (filtros: userId, status)
- **POST /api/payments** - Criar novo registro de pagamento
- **GET /api/payments/[id]** - Obter pagamento específico
- **POST /api/payments/create-intent** - Criar intenção de pagamento
- **POST /api/payments/confirm** - Confirmar pagamento

### Integrações de Pagamento
- **POST /api/stripe/webhook** - Webhook do Stripe
- **GET /api/stripe/config** - Obter configurações do Stripe
- **POST /api/paypal/webhook** - Webhook do PayPal
- **GET /api/paypal/config** - Obter configurações do PayPal

## 6. Endereços (`/api/addresses/`)

### Gerenciamento de Endereços
- **GET /api/addresses** - Listar endereços do usuário
- **POST /api/addresses** - Criar novo endereço
- **GET /api/addresses/[id]** - Obter endereço específico
- **PUT /api/addresses/[id]** - Atualizar endereço
- **DELETE /api/addresses/[id]** - Remover endereço
- **PUT /api/addresses/[id]/default** - Definir como endereço padrão

## 7. Transportadoras (`/api/carriers/`)

### Gerenciamento de Transportadoras
- **GET /api/carriers** - Listar transportadoras disponíveis
- **GET /api/carriers/[id]** - Obter transportadora específica
- **GET /api/carriers/[id]/services** - Listar serviços disponíveis
- **GET /api/carriers/[id]/tracking/[tracking_number]** - Rastrear envio

## 8. Calculadora de Frete (`/api/freight-calculator/`)

### Cálculo de Frete
- **POST /api/freight-calculator** - Calcular opções de frete

## 9. Notificações (`/api/notifications/`)

### Gerenciamento de Notificações
- **GET /api/notifications** - Listar notificações do usuário
- **PUT /api/notifications/[id]/read** - Marcar notificação como lida
- **DELETE /api/notifications/[id]** - Remover notificação
- **PUT /api/notifications/read-all** - Marcar todas como lidas

## 10. Personalização (`/api/customization/`)

### Gerenciamento de Personalização
- **GET /api/customization** - Obter configurações de personalização
- **PUT /api/customization** - Atualizar configurações de personalização

## 11. Serviços de Proteção (`/api/protection-services/`)

### Gerenciamento de Serviços de Proteção
- **GET /api/protection-services** - Listar serviços de proteção disponíveis
- **GET /api/protection-services/[id]** - Obter serviço específico

## 12. Armazenamento (`/api/storage/`)

### Gerenciamento de Armazenamento
- **GET /api/storage** - Obter informações de armazenamento
- **GET /api/storage/fees** - Calcular taxas de armazenamento

## 13. Upload (`/api/upload/`)

### Upload de Arquivos
- **POST /api/upload** - Fazer upload de arquivo
- **DELETE /api/upload/[id]** - Remover arquivo

## 14. Configurações da Plataforma (`/api/platform-config/`)

### Configurações Gerais
- **GET /api/platform-config** - Obter configurações da plataforma
- **PUT /api/platform-config** - Atualizar configurações da plataforma

## 15. Depósitos (`/api/warehouses/`)

### Gerenciamento de Depósitos
- **GET /api/warehouses** - Listar depósitos
- **GET /api/warehouses/[id]** - Obter depósito específico

## 16. Suporte (`/api/support/`)

### Gerenciamento de Tickets de Suporte
- **GET /api/support/tickets** - Listar tickets de suporte
- **POST /api/support/tickets** - Criar novo ticket
- **GET /api/support/tickets/[id]** - Obter ticket específico
- **PUT /api/support/tickets/[id]** - Atualizar ticket
- **POST /api/support/tickets/[id]/messages** - Adicionar mensagem a ticket

## 17. Painel Administrativo (`/api/admin/`)

### Funções Administrativas
- **GET /api/admin/users** - Gerenciar usuários (CRUD)
- **GET /api/admin/analytics** - Obter dados analíticos
- **GET /api/admin/shipments** - Gerenciar envios (CRUD)
- **POST /api/admin/email** - Enviar emails
- **GET /api/admin/storage** - Gerenciar armazenamento
- **GET /api/admin/partners** - Gerenciar parceiros
- **GET /api/admin/tutorials** - Gerenciar tutoriais
- **GET /api/admin/testimonials** - Gerenciar depoimentos
- **GET /api/admin/minio** - Gerenciar armazenamento MinIO
- **GET /api/admin/lead-forms** - Gerenciar formulários de leads
- **GET /api/admin/seo** - Configurações de SEO
- **GET /api/admin/sitemap** - Gerenciar sitemap
- **GET /api/admin/robots** - Gerenciar robots.txt
- **POST /api/admin/test-notification** - Testar envio de notificações

## 18. Blog (`/api/blog/`)

### Gerenciamento de Blog
- **GET /api/blog/posts** - Listar posts
- **POST /api/blog/posts** - Criar novo post
- **GET /api/blog/posts/[id]** - Obter post específico
- **PUT /api/blog/posts/[id]** - Atualizar post
- **DELETE /api/blog/posts/[id]** - Remover post
- **GET /api/blog/categories** - Listar categorias