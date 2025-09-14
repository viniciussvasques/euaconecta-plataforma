# 📚 Documentação da API - Euaconecta Platform

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Autenticação](#autenticação)
3. [Endpoints por Categoria](#endpoints-por-categoria)
   - [Autenticação](#autenticação-1)
   - [Usuários](#usuários)
   - [Pacotes](#pacotes)
   - [Consolidação](#consolidação)
   - [Endereços](#endereços)
   - [Transportadoras](#transportadoras)
   - [Pagamentos](#pagamentos)
   - [Relatórios](#relatórios)
   - [Suporte](#suporte)
   - [Configurações](#configurações)
4. [Códigos de Status](#códigos-de-status)
5. [Exemplos de Uso](#exemplos-de-uso)

---

## 🔍 Visão Geral

A API da Euaconecta Platform é uma API RESTful que permite gerenciar pacotes, consolidações, usuários e operações logísticas. Todas as respostas seguem um formato padronizado:

### Formato de Resposta Padrão

```json
{
  "success": true,
  "data": {}, // ou array
  "message": "Mensagem de sucesso" // opcional
}
```

### Formato de Erro Padrão

```json
{
  "success": false,
  "error": "Mensagem de erro"
}
```

---

## 🔐 Autenticação

A API utiliza autenticação baseada em cookies de sessão. Todas as rotas protegidas requerem um cookie `session` válido.

### Headers Obrigatórios

```
Cookie: session=<session_token>
Content-Type: application/json
```

---

## 📡 Endpoints por Categoria

### 🔑 Autenticação

#### `POST /api/auth/login`
Autentica um usuário no sistema.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "name": "Nome do Usuário",
      "email": "user@example.com",
      "role": "CLIENT"
    }
  }
}
```

#### `POST /api/auth/register`
Registra um novo usuário.

**Body:**
```json
{
  "name": "Nome do Usuário",
  "email": "user@example.com",
  "password": "password123",
  "role": "CLIENT"
}
```

#### `POST /api/auth/logout`
Encerra a sessão do usuário.

#### `GET /api/auth/me`
Retorna informações do usuário autenticado.

#### `POST /api/auth/activate`
Ativa uma conta de usuário.

**Body:**
```json
{
  "token": "activation_token"
}
```

---

### 👥 Usuários

#### `GET /api/users`
Lista todos os usuários (admin apenas).

**Query Parameters:**
- `page`: Número da página (padrão: 1)
- `limit`: Itens por página (padrão: 10)
- `search`: Termo de busca
- `role`: Filtrar por role

#### `GET /api/users/search`
Busca usuários por termo.

**Query Parameters:**
- `q`: Termo de busca

#### `GET /api/users/[id]`
Retorna dados de um usuário específico.

#### `PUT /api/users/[id]`
Atualiza dados de um usuário.

#### `GET /api/users/[id]/stats`
Retorna estatísticas de um usuário.

#### `GET /api/users/[id]/history`
Retorna histórico de atividades do usuário.

#### `POST /api/users/[id]/evaluation`
Avalia um usuário.

#### `POST /api/users/[id]/observations`
Adiciona observações a um usuário.

#### `POST /api/users/[id]/generate-suite`
Gera um número de suite para o usuário.

#### `POST /api/users/me/generate-suite`
Gera suite para o usuário autenticado.

---

### 📦 Pacotes

#### `GET /api/packages`
Lista pacotes do usuário autenticado.

**Query Parameters:**
- `status`: Filtrar por status
- `page`: Número da página
- `limit`: Itens por página

#### `POST /api/packages`
Cria um novo pacote.

**Body:**
```json
{
  "description": "Descrição do pacote",
  "weightGrams": 1000,
  "purchasePrice": 50.00,
  "store": "Nome da Loja",
  "orderNumber": "ORDER123",
  "carrier": "UPS",
  "declaredValue": 50.00,
  "packageType": "BOX",
  "lengthCm": 30,
  "widthCm": 20,
  "heightCm": 10
}
```

#### `GET /api/packages/[id]`
Retorna dados de um pacote específico.

#### `PUT /api/packages/[id]`
Atualiza dados de um pacote.

#### `POST /api/packages/[id]/confirm`
Confirma recebimento de um pacote.

#### `GET /api/packages/stats`
Retorna estatísticas dos pacotes.

---

### 📋 Consolidação

#### `GET /api/consolidation`
Lista consolidações do usuário.

**Query Parameters:**
- `status`: Filtrar por status
- `page`: Número da página
- `limit`: Itens por página

#### `POST /api/consolidation`
Cria uma nova consolidação.

**Body:**
```json
{
  "name": "Nome da Consolidação",
  "consolidationType": "SIMPLE",
  "packageIds": ["package_id_1", "package_id_2"],
  "customInstructions": "Instruções especiais"
}
```

#### `GET /api/consolidation/[id]`
Retorna dados de uma consolidação específica.

#### `PUT /api/consolidation/[id]`
Atualiza dados de uma consolidação.

#### `DELETE /api/consolidation/[id]`
Remove uma consolidação.

#### `POST /api/consolidation/[id]/close`
Fecha uma caixa de consolidação.

#### `POST /api/consolidation/[id]/consolidate`
Consolida uma caixa com itens adicionais.

**Body:**
```json
{
  "extraProtection": ["BUBBLE_WRAP"],
  "removeInvoice": false,
  "customInstructions": "Instruções",
  "doubleBox": false,
  "bubbleWrap": true,
  "additionalItems": [],
  "serviceType": "STANDARD",
  "deliveryAddressId": "address_id"
}
```

#### `POST /api/consolidation/[id]/add-package`
Adiciona um pacote à consolidação.

#### `POST /api/consolidation/[id]/remove-package`
Remove um pacote da consolidação.

#### `PUT /api/consolidation/[id]/status`
Atualiza o status de uma consolidação.

**Body:**
```json
{
  "status": "IN_PROGRESS",
  "trackingCode": "TRACK123" // opcional
}
```

#### `GET /api/consolidation/[id]/packages`
Lista pacotes de uma consolidação.

#### `POST /api/consolidation/[id]/packages`
Adiciona múltiplos pacotes à consolidação.

#### `DELETE /api/consolidation/[id]/packages`
Remove múltiplos pacotes da consolidação.

---

### 🏠 Endereços

#### `GET /api/addresses`
Lista endereços do usuário autenticado.

#### `POST /api/addresses`
Cria um novo endereço.

**Body:**
```json
{
  "name": "Casa",
  "street": "Rua das Flores, 123",
  "city": "São Paulo",
  "state": "SP",
  "zipCode": "01234-567",
  "country": "Brasil",
  "isDefault": false
}
```

#### `GET /api/addresses/[id]`
Retorna dados de um endereço específico.

#### `PUT /api/addresses/[id]`
Atualiza dados de um endereço.

#### `DELETE /api/addresses/[id]`
Remove um endereço.

#### `POST /api/addresses/[id]/default`
Define um endereço como padrão.

---

### 🚚 Transportadoras

#### `GET /api/carriers`
Lista todas as transportadoras.

#### `POST /api/carriers`
Cria uma nova transportadora (admin apenas).

#### `GET /api/carriers/active`
Lista transportadoras ativas.

#### `GET /api/carriers/[id]`
Retorna dados de uma transportadora específica.

#### `PUT /api/carriers/[id]`
Atualiza dados de uma transportadora.

#### `POST /api/carriers/[id]/toggle-active`
Ativa/desativa uma transportadora.

#### `POST /api/carriers/[id]/test-connection`
Testa conexão com a transportadora.

#### `POST /api/carriers/[id]/credentials`
Atualiza credenciais da transportadora.

---

### 💳 Pagamentos

#### `GET /api/payments`
Lista pagamentos do usuário.

#### `POST /api/payments`
Cria um novo pagamento.

#### `POST /api/payments/create-intent`
Cria intenção de pagamento.

#### `POST /api/payments/confirm`
Confirma um pagamento.

#### `GET /api/payment-providers`
Lista provedores de pagamento.

#### `GET /api/payment-providers/active`
Lista provedores ativos.

#### `POST /api/payment-providers/[id]/toggle-active`
Ativa/desativa provedor.

#### `POST /api/payment-providers/[id]/credentials`
Atualiza credenciais do provedor.

---

### 🏪 Stripe

#### `POST /api/stripe/create-checkout-session`
Cria sessão de checkout do Stripe.

#### `GET /api/stripe/check-session`
Verifica status de uma sessão.

#### `POST /api/stripe/webhook`
Webhook do Stripe para processar eventos.

---

### 💰 PayPal

#### `POST /api/paypal/create-order`
Cria pedido no PayPal.

#### `POST /api/paypal/capture-order`
Captura pagamento do PayPal.

#### `POST /api/paypal/webhook`
Webhook do PayPal para processar eventos.

---

### 📊 Relatórios

#### `GET /api/reports/dashboard`
Retorna dados do dashboard.

#### `GET /api/reports/generate-excel`
Gera relatório em Excel.

#### `GET /api/reports/generate-pdf`
Gera relatório em PDF.

---

### 🎫 Suporte

#### `GET /api/support/tickets`
Lista tickets de suporte.

#### `POST /api/support/tickets`
Cria novo ticket.

#### `GET /api/support/tickets/[id]`
Retorna dados de um ticket.

#### `PUT /api/support/tickets/[id]`
Atualiza um ticket.

#### `GET /api/support/messages`
Lista mensagens de suporte.

#### `POST /api/support/messages`
Envia mensagem de suporte.

---

### 🔔 Notificações

#### `GET /api/notifications`
Lista notificações do usuário.

#### `GET /api/notifications/unread`
Lista notificações não lidas.

#### `POST /api/notifications/[id]/read`
Marca notificação como lida.

---

### ⚙️ Configurações

#### `GET /api/platform-config`
Retorna configurações da plataforma.

#### `PUT /api/platform-config`
Atualiza configurações da plataforma.

#### `GET /api/storage`
Lista políticas de armazenamento.

#### `POST /api/storage`
Cria política de armazenamento.

#### `GET /api/storage/free-days`
Retorna dias gratuitos de armazenamento.

#### `GET /api/email-templates`
Lista templates de email.

#### `PUT /api/email-templates`
Atualiza templates de email.

#### `GET /api/protection-services`
Lista serviços de proteção.

#### `POST /api/protection-services`
Cria serviço de proteção.

#### `GET /api/warehouses`
Lista warehouses.

#### `POST /api/warehouses`
Cria warehouse.

#### `GET /api/warehouses/[id]`
Retorna dados de um warehouse.

#### `PUT /api/warehouses/[id]`
Atualiza warehouse.

#### `POST /api/warehouses/[id]/default`
Define warehouse como padrão.

#### `GET /api/suites`
Lista suites.

#### `GET /api/suites/[userId]`
Lista suites de um usuário.

#### `GET /api/shipments`
Lista envios.

#### `POST /api/shipments`
Cria novo envio.

#### `GET /api/freight/calculate`
Calcula frete.

**Query Parameters:**
- `weight`: Peso em gramas
- `destination`: Destino
- `serviceType`: Tipo de serviço

---

### 📤 Upload

#### `POST /api/upload/photo`
Faz upload de foto.

**Body:** FormData com arquivo de imagem.

---

## 📊 Códigos de Status

| Código | Descrição |
|--------|-----------|
| 200 | Sucesso |
| 201 | Criado com sucesso |
| 400 | Requisição inválida |
| 401 | Não autenticado |
| 403 | Sem permissão |
| 404 | Não encontrado |
| 409 | Conflito |
| 422 | Dados inválidos |
| 500 | Erro interno do servidor |

---

## 💡 Exemplos de Uso

### Criar um Pacote

```javascript
const response = await fetch('/api/packages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Cookie': 'session=your_session_token'
  },
  body: JSON.stringify({
    description: 'Produto eletrônico',
    weightGrams: 500,
    purchasePrice: 25.99,
    store: 'Amazon',
    orderNumber: 'AMZ123456',
    carrier: 'UPS',
    declaredValue: 25.99,
    packageType: 'BOX',
    lengthCm: 20,
    widthCm: 15,
    heightCm: 10
  })
});

const data = await response.json();
console.log(data);
```

### Criar uma Consolidação

```javascript
const response = await fetch('/api/consolidation', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Cookie': 'session=your_session_token'
  },
  body: JSON.stringify({
    name: 'Consolidação Janeiro 2024',
    consolidationType: 'SIMPLE',
    packageIds: ['package_id_1', 'package_id_2'],
    customInstructions: 'Manter etiquetas originais'
  })
});

const data = await response.json();
console.log(data);
```

### Calcular Frete

```javascript
const response = await fetch('/api/freight/calculate?weight=1000&destination=SP&serviceType=STANDARD', {
  method: 'GET',
  headers: {
    'Cookie': 'session=your_session_token'
  }
});

const data = await response.json();
console.log(data);
```

---

## 🔧 Configuração de Desenvolvimento

### Variáveis de Ambiente Necessárias

```env
# Banco de Dados
DATABASE_URL="postgresql://user:password@localhost:5432/euaconecta"

# Autenticação
NEXTAUTH_SECRET="your_secret_key"
NEXTAUTH_URL="http://localhost:3000"

# Stripe
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."

# PayPal
PAYPAL_CLIENT_ID="your_paypal_client_id"
PAYPAL_CLIENT_SECRET="your_paypal_secret"

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your_email@gmail.com"
SMTP_PASS="your_app_password"

# AWS S3
AWS_ACCESS_KEY_ID="your_aws_key"
AWS_SECRET_ACCESS_KEY="your_aws_secret"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="your_bucket_name"
```

### Executando Localmente

```bash
# Instalar dependências
npm install

# Executar migrações do banco
npx prisma migrate dev

# Executar em modo desenvolvimento
npm run dev
```

---

## 📝 Notas Importantes

1. **Autenticação**: Todas as rotas protegidas requerem autenticação via cookie de sessão.

2. **Rate Limiting**: A API implementa rate limiting para prevenir abuso.

3. **Validação**: Todos os dados de entrada são validados usando Zod.

4. **Logs**: Todas as operações são logadas para auditoria.

5. **Webhooks**: Webhooks do Stripe e PayPal são processados automaticamente.

6. **Upload**: Uploads de arquivos são limitados a 10MB por arquivo.

7. **Paginação**: Listas grandes são paginadas com limite padrão de 10 itens.

---

## 🆘 Suporte

Para dúvidas sobre a API, entre em contato através do sistema de suporte integrado ou consulte a documentação técnica adicional.

---

*Documentação gerada automaticamente - Última atualização: Janeiro 2024*
