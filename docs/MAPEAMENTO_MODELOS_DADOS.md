# Mapeamento de Modelos de Dados

## Análise do Schema do Prisma

Este documento mapeia todos os modelos de dados e suas relações presentes no schema do Prisma do projeto original EuaConecta, para garantir que sejam corretamente replicados no novo projeto.

## Modelos Principais

### 1. User (Usuário)
- Gerenciamento de contas de usuários
- Autenticação e autorização
- Perfis de cliente, admin, operador, etc.

**Campos principais:**
- `id`: Identificador único
- `email`: Email do usuário (único)
- `name`: Nome do usuário
- `password`: Senha criptografada
- `role`: Papel do usuário (SUPER_ADMIN, ADMIN, OPERATOR, MANAGER, CLIENT, SUPPORT)
- `isActive`: Status da conta
- `suiteNumber`: Número da suíte (caixa postal)
- `cpf`: CPF do usuário (para clientes brasileiros)
- `phone`: Telefone de contato
- `permissions`: Permissões específicas
- `canManageUsers, canManagePackages, etc.`: Flags de permissão granular

**Relações:**
- `addresses`: Endereços do usuário
- `packages`: Pacotes associados ao usuário
- `consolidationGroups`: Grupos de consolidação
- `shipments`: Envios
- `payments`: Pagamentos realizados
- `supportTickets`: Tickets de suporte
- `notifications`: Notificações

### 2. Package (Pacote)
- Rastreamento de encomendas recebidas
- Gestão do ciclo de vida do pacote

**Campos principais:**
- `id`: Identificador único
- `ownerId`: ID do proprietário (usuário)
- `description`: Descrição do pacote
- `store`: Loja onde foi comprado
- `orderNumber`: Número do pedido
- `purchasePrice`: Preço de compra
- `carrier`: Transportadora de entrada
- `trackingIn`: Código de rastreamento de entrada
- `status`: Status atual (PENDING, RECEIVED, READY_TO_SHIP, SHIPPED)
- `weightGrams`: Peso em gramas
- `lengthCm, widthCm, heightCm`: Dimensões
- `declaredValue`: Valor declarado

**Relações:**
- `owner`: Usuário proprietário
- `shipment`: Envio associado
- `consolidationGroup`: Grupo de consolidação
- `dimensions`: Dimensões estruturadas

### 3. Shipment (Envio)
- Gerenciamento de envios para o cliente final
- Rastreamento de remessas

**Campos principais:**
- `id`: Identificador único
- `userId`: ID do usuário
- `status`: Status (DRAFT, LABEL_CREATED, IN_TRANSIT, DELIVERED, RETURNED, CANCELLED)
- `outboundCarrier`: Transportadora de saída
- `outboundService`: Serviço utilizado
- `trackingOut`: Código de rastreamento de saída
- `totalWeightGrams`: Peso total
- `insuranceUsd`: Valor do seguro

**Relações:**
- `user`: Usuário relacionado
- `packages`: Pacotes incluídos no envio
- `carrier`: Transportadora

### 4. ConsolidationGroup (Grupo de Consolidação)
- Agrupamento de pacotes para envio conjunto
- Reembalagem e otimização

**Campos principais:**
- `id`: Identificador único
- `userId`: ID do usuário
- `name`: Nome do grupo
- `status`: Status da consolidação
- `type`: Tipo (SIMPLE, REPACK)
- `totalWeightGrams`: Peso total
- `consolidationFeeUsd`: Taxa de consolidação

**Relações:**
- `user`: Usuário proprietário
- `packages`: Pacotes incluídos

### 5. Payment (Pagamento)
- Registro de pagamentos
- Integração com gateways

**Campos principais:**
- `id`: Identificador único
- `userId`: ID do usuário
- `invoiceId`: ID da fatura
- `providerCode`: Código do provedor (stripe/paypal)
- `intentId`: ID da intenção de pagamento
- `amountCents`: Valor em centavos
- `currency`: Moeda
- `status`: Status do pagamento

**Relações:**
- `user`: Usuário que realizou o pagamento
- `invoice`: Fatura associada
- `provider`: Provedor de pagamento

### 6. Address (Endereço)
- Endereços dos usuários

**Campos principais:**
- `id`: Identificador único
- `userId`: ID do usuário
- `name`: Nome do endereço
- `line1, line2`: Linhas de endereço
- `city`: Cidade
- `state`: Estado
- `postalCode`: CEP
- `country`: País
- `isDefault`: Se é o endereço padrão

**Relações:**
- `user`: Usuário associado

### 7. Carrier (Transportadora)
- Configuração de transportadoras

**Campos principais:**
- `id`: Identificador único
- `name`: Nome da transportadora
- `code`: Código único
- `hasApi`: Se tem integração com API
- `apiKey, apiSecret`: Credenciais da API
- `baseRate`: Taxa base
- `ratePerKg`: Taxa por kg
- `estimatedDays`: Dias estimados para entrega

**Relações:**
- `services`: Serviços oferecidos
- `pricingTables`: Tabelas de preço
- `deliveryZones`: Zonas de entrega

### 8. Invoice (Fatura)
- Faturas para pagamento

**Campos principais:**
- `id`: Identificador único
- `userId`: ID do usuário
- `number`: Número da fatura
- `amountCents`: Valor em centavos
- `currency`: Moeda
- `pdfUrl`: URL do PDF da fatura
- `status`: Status (paid, open, uncollectible, void)

**Relações:**
- `user`: Usuário associado
- `payments`: Pagamentos associados

### 9. SupportTicket (Ticket de Suporte)
- Gestão de tickets de suporte

**Campos principais:**
- `id`: Identificador único
- `userId`: ID do usuário
- `subject`: Assunto
- `status`: Status do ticket
- `priority`: Prioridade
- `category`: Categoria

**Relações:**
- `user`: Usuário que abriu o ticket
- `assignedTo`: Agente designado
- `messages`: Mensagens relacionadas

### 10. Notification (Notificação)
- Sistema de notificações

**Campos principais:**
- `id`: Identificador único
- `userId`: ID do usuário
- `type`: Tipo de notificação
- `title`: Título
- `content`: Conteúdo
- `status`: Status (PENDING, SENT, FAILED, READ)
- `channel`: Canal (EMAIL, SMS, PUSH, IN_APP)

**Relações:**
- `user`: Usuário destinatário

## Enums (Tipos Enumerados)

### 1. UserRole
- `SUPER_ADMIN`: Super administrador
- `ADMIN`: Administrador
- `OPERATOR`: Operador
- `MANAGER`: Gerente
- `CLIENT`: Cliente
- `SUPPORT`: Suporte

### 2. PackageStatus
- `PENDING`: Pendente
- `RECEIVED`: Recebido
- `READY_TO_SHIP`: Pronto para envio
- `SHIPPED`: Enviado

### 3. ShipmentStatus
- `DRAFT`: Rascunho
- `LABEL_CREATED`: Etiqueta criada
- `IN_TRANSIT`: Em trânsito
- `DELIVERED`: Entregue
- `RETURNED`: Devolvido
- `CANCELLED`: Cancelado

### 4. ConsolidationType
- `SIMPLE`: Consolidação simples
- `REPACK`: Reembalagem

### 5. ConsolidationStatus
- `OPEN`: Aberto para receber mais itens
- `PENDING`: Aguardando consolidação
- `IN_PROGRESS`: Em processo
- `READY_TO_SHIP`: Pronto para envio
- `SHIPPED`: Enviado
- `CANCELLED`: Cancelado

### 6. ProtectionType
- `BUBBLE_WRAP`: Plástico bolha
- `DOUBLE_BOX`: Caixa dupla
- `SECURITY_TAPE`: Fita de segurança
- `PAPER_FILLING`: Enchimento de papel
- `CUSTOM_PACKAGING`: Embalagem personalizada

### 7. NotificationType
- `EMAIL`: Email
- `SMS`: SMS
- `PUSH`: Notificação push
- `IN_APP`: Notificação no aplicativo

### 8. NotificationStatus
- `PENDING`: Pendente
- `SENT`: Enviada
- `FAILED`: Falha no envio
- `READ`: Lida

## Relações Principais

1. **Usuário → Pacotes**: Um usuário pode ter múltiplos pacotes
2. **Usuário → Envios**: Um usuário pode ter múltiplos envios
3. **Usuário → Pagamentos**: Um usuário pode ter múltiplos pagamentos
4. **Usuário → Endereços**: Um usuário pode ter múltiplos endereços
5. **Pacotes → Envio**: Um pacote pode pertencer a um envio
6. **Pacotes → Grupo de Consolidação**: Pacotes podem ser consolidados em grupos
7. **Pagamento → Fatura**: Um pagamento pode estar associado a uma fatura
8. **Transportadora → Serviços**: Uma transportadora oferece múltiplos serviços
9. **Usuário → Tickets de Suporte**: Um usuário pode abrir múltiplos tickets
10. **Usuário → Notificações**: Um usuário pode receber múltiplas notificações