# 🚀 Exemplos Práticos da API - Euaconecta Platform

## 📋 Índice

1. [Fluxo Completo de Usuário](#fluxo-completo-de-usuário)
2. [Exemplos por Endpoint](#exemplos-por-endpoint)
3. [Códigos de Exemplo](#códigos-de-exemplo)
4. [Tratamento de Erros](#tratamento-de-erros)
5. [Testes de API](#testes-de-api)

---

## 🔄 Fluxo Completo de Usuário

### 1. Registro e Autenticação

```javascript
// 1. Registrar novo usuário
const registerResponse = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'João Silva',
    email: 'joao@example.com',
    password: 'senha123',
    role: 'CLIENT'
  })
});

// 2. Fazer login
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'joao@example.com',
    password: 'senha123'
  })
});

// 3. Verificar dados do usuário
const meResponse = await fetch('/api/auth/me', {
  headers: { 'Cookie': 'session=your_session_token' }
});
```

### 2. Gerenciamento de Endereços

```javascript
// Criar endereço
const addressResponse = await fetch('/api/addresses', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Cookie': 'session=your_session_token'
  },
  body: JSON.stringify({
    name: 'Casa',
    street: 'Rua das Flores, 123',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01234-567',
    country: 'Brasil',
    isDefault: true
  })
});

// Listar endereços
const addressesResponse = await fetch('/api/addresses', {
  headers: { 'Cookie': 'session=your_session_token' }
});
```

### 3. Gerenciamento de Pacotes

```javascript
// Criar pacote
const packageResponse = await fetch('/api/packages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Cookie': 'session=your_session_token'
  },
  body: JSON.stringify({
    description: 'iPhone 15 Pro',
    weightGrams: 187,
    purchasePrice: 999.99,
    store: 'Apple Store',
    orderNumber: 'APL123456789',
    carrier: 'UPS',
    declaredValue: 999.99,
    packageType: 'BOX',
    lengthCm: 15,
    widthCm: 8,
    heightCm: 1
  })
});

// Listar pacotes
const packagesResponse = await fetch('/api/packages?status=RECEIVED', {
  headers: { 'Cookie': 'session=your_session_token' }
});

// Confirmar recebimento
const confirmResponse = await fetch('/api/packages/package_id/confirm', {
  method: 'POST',
  headers: { 'Cookie': 'session=your_session_token' }
});
```

### 4. Criação de Consolidação

```javascript
// Criar consolidação
const consolidationResponse = await fetch('/api/consolidation', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Cookie': 'session=your_session_token'
  },
  body: JSON.stringify({
    name: 'Consolidação Janeiro 2024',
    consolidationType: 'SIMPLE',
    packageIds: ['package_id_1', 'package_id_2'],
    customInstructions: 'Manter etiquetas originais e adicionar proteção extra'
  })
});

// Adicionar pacote à consolidação
const addPackageResponse = await fetch('/api/consolidation/consolidation_id/add-package', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Cookie': 'session=your_session_token'
  },
  body: JSON.stringify({
    packageId: 'package_id_3'
  })
});
```

### 5. Processo de Consolidação

```javascript
// Fechar caixa
const closeResponse = await fetch('/api/consolidation/consolidation_id/close', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Cookie': 'session=your_session_token'
  },
  body: JSON.stringify({
    finalWeightGrams: 500,
    trackingCode: 'TRACK123'
  })
});

// Consolidar com itens adicionais
const consolidateResponse = await fetch('/api/consolidation/consolidation_id/consolidate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Cookie': 'session=your_session_token'
  },
  body: JSON.stringify({
    extraProtection: ['BUBBLE_WRAP', 'DOUBLE_BOX'],
    removeInvoice: false,
    customInstructions: 'Adicionar proteção extra para itens frágeis',
    doubleBox: true,
    bubbleWrap: true,
    additionalItems: [],
    serviceType: 'EXPRESS',
    deliveryAddressId: 'address_id'
  })
});
```

### 6. Processo de Pagamento

```javascript
// Criar intenção de pagamento
const paymentIntentResponse = await fetch('/api/payments/create-intent', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Cookie': 'session=your_session_token'
  },
  body: JSON.stringify({
    amount: 25.99,
    currency: 'USD',
    description: 'Taxa de consolidação',
    consolidationId: 'consolidation_id'
  })
});

// Criar sessão de checkout Stripe
const stripeSessionResponse = await fetch('/api/stripe/create-checkout-session', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Cookie': 'session=your_session_token'
  },
  body: JSON.stringify({
    amount: 2599, // em centavos
    currency: 'usd',
    successUrl: 'https://yourapp.com/success',
    cancelUrl: 'https://yourapp.com/cancel',
    consolidationId: 'consolidation_id'
  })
});
```

---

## 📡 Exemplos por Endpoint

### Autenticação

#### Login com Diferentes Roles

```javascript
// Cliente
const clientLogin = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'cliente@example.com',
    password: 'senha123'
  })
});

// Admin
const adminLogin = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@example.com',
    password: 'admin123'
  })
});
```

### Usuários

#### Busca Avançada de Usuários

```javascript
// Buscar usuários com filtros
const searchResponse = await fetch('/api/users?page=1&limit=20&search=joão&role=CLIENT', {
  headers: { 'Cookie': 'session=admin_session_token' }
});

// Buscar usuário específico
const userResponse = await fetch('/api/users/user_id', {
  headers: { 'Cookie': 'session=admin_session_token' }
});

// Avaliar usuário
const evaluationResponse = await fetch('/api/users/user_id/evaluation', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Cookie': 'session=admin_session_token'
  },
  body: JSON.stringify({
    score: 4.5,
    comments: 'Excelente cliente, sempre pontual nos pagamentos'
  })
});
```

### Pacotes

#### Gerenciamento Avançado de Pacotes

```javascript
// Listar pacotes com filtros
const packagesResponse = await fetch('/api/packages?status=RECEIVED&page=1&limit=10', {
  headers: { 'Cookie': 'session=your_session_token' }
});

// Atualizar pacote
const updateResponse = await fetch('/api/packages/package_id', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Cookie': 'session=your_session_token'
  },
  body: JSON.stringify({
    description: 'iPhone 15 Pro Max - Atualizado',
    weightGrams: 221,
    declaredValue: 1199.99
  })
});

// Obter estatísticas
const statsResponse = await fetch('/api/packages/stats', {
  headers: { 'Cookie': 'session=your_session_token' }
});
```

### Consolidação

#### Gerenciamento Completo de Consolidação

```javascript
// Listar consolidações por status
const consolidationsResponse = await fetch('/api/consolidation?status=PENDING', {
  headers: { 'Cookie': 'session=your_session_token' }
});

// Atualizar status da consolidação (admin)
const statusResponse = await fetch('/api/consolidation/consolidation_id/status', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Cookie': 'session=admin_session_token'
  },
  body: JSON.stringify({
    status: 'IN_PROGRESS',
    trackingCode: 'TRACK123456'
  })
});

// Remover pacote da consolidação
const removeResponse = await fetch('/api/consolidation/consolidation_id/remove-package', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Cookie': 'session=your_session_token'
  },
  body: JSON.stringify({
    packageId: 'package_id'
  })
});
```

### Transportadoras

#### Configuração de Transportadoras

```javascript
// Listar transportadoras ativas
const carriersResponse = await fetch('/api/carriers/active', {
  headers: { 'Cookie': 'session=your_session_token' }
});

// Testar conexão com transportadora
const testResponse = await fetch('/api/carriers/carrier_id/test-connection', {
  method: 'POST',
  headers: { 'Cookie': 'session=admin_session_token' }
});

// Atualizar credenciais
const credentialsResponse = await fetch('/api/carriers/carrier_id/credentials', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Cookie': 'session=admin_session_token'
  },
  body: JSON.stringify({
    apiKey: 'new_api_key',
    apiSecret: 'new_api_secret',
    testMode: true
  })
});
```

### Relatórios

#### Geração de Relatórios

```javascript
// Dashboard
const dashboardResponse = await fetch('/api/reports/dashboard', {
  headers: { 'Cookie': 'session=admin_session_token' }
});

// Relatório Excel
const excelResponse = await fetch('/api/reports/generate-excel?startDate=2024-01-01&endDate=2024-01-31', {
  headers: { 'Cookie': 'session=admin_session_token' }
});

// Relatório PDF
const pdfResponse = await fetch('/api/reports/generate-pdf?type=consolidations&month=2024-01', {
  headers: { 'Cookie': 'session=admin_session_token' }
});
```

---

## 💻 Códigos de Exemplo

### Cliente JavaScript/TypeScript

```typescript
class EuaconectaAPI {
  private baseUrl: string;
  private sessionToken: string | null = null;

  constructor(baseUrl: string = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
  }

  // Autenticação
  async login(email: string, password: string) {
    const response = await fetch(`${this.baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    if (data.success) {
      this.sessionToken = data.data.sessionToken;
    }
    return data;
  }

  // Método auxiliar para requisições autenticadas
  private async authenticatedRequest(endpoint: string, options: RequestInit = {}) {
    if (!this.sessionToken) {
      throw new Error('Não autenticado');
    }

    return fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `session=${this.sessionToken}`,
        ...options.headers
      }
    });
  }

  // Pacotes
  async getPackages(status?: string) {
    const url = status ? `/api/packages?status=${status}` : '/api/packages';
    const response = await this.authenticatedRequest(url);
    return response.json();
  }

  async createPackage(packageData: any) {
    const response = await this.authenticatedRequest('/api/packages', {
      method: 'POST',
      body: JSON.stringify(packageData)
    });
    return response.json();
  }

  // Consolidação
  async getConsolidations(status?: string) {
    const url = status ? `/api/consolidation?status=${status}` : '/api/consolidation';
    const response = await this.authenticatedRequest(url);
    return response.json();
  }

  async createConsolidation(consolidationData: any) {
    const response = await this.authenticatedRequest('/api/consolidation', {
      method: 'POST',
      body: JSON.stringify(consolidationData)
    });
    return response.json();
  }

  // Endereços
  async getAddresses() {
    const response = await this.authenticatedRequest('/api/addresses');
    return response.json();
  }

  async createAddress(addressData: any) {
    const response = await this.authenticatedRequest('/api/addresses', {
      method: 'POST',
      body: JSON.stringify(addressData)
    });
    return response.json();
  }
}

// Uso da API
const api = new EuaconectaAPI();

// Exemplo de uso
async function exemploUso() {
  try {
    // Login
    await api.login('user@example.com', 'password123');
    
    // Criar endereço
    const address = await api.createAddress({
      name: 'Casa',
      street: 'Rua das Flores, 123',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
      country: 'Brasil',
      isDefault: true
    });
    
    // Criar pacote
    const package = await api.createPackage({
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
    });
    
    // Criar consolidação
    const consolidation = await api.createConsolidation({
      name: 'Consolidação Janeiro 2024',
      consolidationType: 'SIMPLE',
      packageIds: [package.data.id],
      customInstructions: 'Manter etiquetas originais'
    });
    
    console.log('Processo concluído com sucesso!');
  } catch (error) {
    console.error('Erro:', error);
  }
}
```

### Cliente Python

```python
import requests
import json

class EuaconectaAPI:
    def __init__(self, base_url="http://localhost:3000"):
        self.base_url = base_url
        self.session_token = None
        self.session = requests.Session()

    def login(self, email, password):
        response = self.session.post(
            f"{self.base_url}/api/auth/login",
            json={"email": email, "password": password}
        )
        data = response.json()
        if data.get("success"):
            self.session_token = data["data"]["sessionToken"]
            self.session.cookies.set("session", self.session_token)
        return data

    def get_packages(self, status=None):
        url = f"{self.base_url}/api/packages"
        if status:
            url += f"?status={status}"
        response = self.session.get(url)
        return response.json()

    def create_package(self, package_data):
        response = self.session.post(
            f"{self.base_url}/api/packages",
            json=package_data
        )
        return response.json()

    def create_consolidation(self, consolidation_data):
        response = self.session.post(
            f"{self.base_url}/api/consolidation",
            json=consolidation_data
        )
        return response.json()

# Exemplo de uso
api = EuaconectaAPI()
api.login("user@example.com", "password123")

package = api.create_package({
    "description": "Produto eletrônico",
    "weightGrams": 500,
    "purchasePrice": 25.99,
    "store": "Amazon",
    "orderNumber": "AMZ123456",
    "carrier": "UPS",
    "declaredValue": 25.99,
    "packageType": "BOX",
    "lengthCm": 20,
    "widthCm": 15,
    "heightCm": 10
})

print(f"Pacote criado: {package}")
```

---

## ⚠️ Tratamento de Erros

### Estrutura de Erro Padrão

```json
{
  "success": false,
  "error": "Mensagem de erro específica",
  "code": "ERROR_CODE", // opcional
  "details": {} // opcional
}
```

### Códigos de Erro Comuns

| Código | Descrição | Solução |
|--------|-----------|---------|
| `AUTH_REQUIRED` | Autenticação necessária | Fazer login |
| `INVALID_CREDENTIALS` | Credenciais inválidas | Verificar email/senha |
| `INSUFFICIENT_PERMISSIONS` | Sem permissão | Verificar role do usuário |
| `VALIDATION_ERROR` | Dados inválidos | Verificar formato dos dados |
| `NOT_FOUND` | Recurso não encontrado | Verificar ID do recurso |
| `DUPLICATE_ENTRY` | Entrada duplicada | Verificar se já existe |
| `PAYMENT_FAILED` | Pagamento falhou | Verificar dados de pagamento |
| `CARRIER_ERROR` | Erro na transportadora | Verificar credenciais |

### Exemplo de Tratamento de Erros

```javascript
async function handleAPIRequest(requestFunction) {
  try {
    const response = await requestFunction();
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Erro na requisição');
    }
    
    if (!data.success) {
      throw new Error(data.error || 'Erro na operação');
    }
    
    return data;
  } catch (error) {
    console.error('Erro na API:', error.message);
    
    // Tratamento específico por tipo de erro
    if (error.message.includes('AUTH_REQUIRED')) {
      // Redirecionar para login
      window.location.href = '/auth/login';
    } else if (error.message.includes('INSUFFICIENT_PERMISSIONS')) {
      // Mostrar mensagem de permissão
      alert('Você não tem permissão para esta ação');
    } else {
      // Erro genérico
      alert('Erro: ' + error.message);
    }
    
    throw error;
  }
}

// Uso
try {
  const packages = await handleAPIRequest(() => 
    fetch('/api/packages', {
      headers: { 'Cookie': 'session=your_token' }
    })
  );
  console.log('Pacotes:', packages.data);
} catch (error) {
  // Erro já tratado na função
}
```

---

## 🧪 Testes de API

### Testes com cURL

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Criar pacote
curl -X POST http://localhost:3000/api/packages \
  -H "Content-Type: application/json" \
  -H "Cookie: session=your_session_token" \
  -d '{
    "description": "Produto teste",
    "weightGrams": 500,
    "purchasePrice": 25.99,
    "store": "Test Store",
    "orderNumber": "TEST123",
    "carrier": "UPS",
    "declaredValue": 25.99,
    "packageType": "BOX",
    "lengthCm": 20,
    "widthCm": 15,
    "heightCm": 10
  }'

# Listar pacotes
curl -X GET http://localhost:3000/api/packages \
  -H "Cookie: session=your_session_token"
```

### Testes com Postman

1. **Configurar Environment:**
   - `base_url`: `http://localhost:3000`
   - `session_token`: `{{session_token}}`

2. **Collection de Testes:**
   ```json
   {
     "info": {
       "name": "Euaconecta API Tests",
       "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
     },
     "item": [
       {
         "name": "Auth",
         "item": [
           {
             "name": "Login",
             "request": {
               "method": "POST",
               "header": [
                 {
                   "key": "Content-Type",
                   "value": "application/json"
                 }
               ],
               "body": {
                 "mode": "raw",
                 "raw": "{\n  \"email\": \"user@example.com\",\n  \"password\": \"password123\"\n}"
               },
               "url": {
                 "raw": "{{base_url}}/api/auth/login",
                 "host": ["{{base_url}}"],
                 "path": ["api", "auth", "login"]
               }
             }
           }
         ]
       }
     ]
   }
   ```

### Testes Automatizados com Jest

```javascript
describe('Euaconecta API', () => {
  let sessionToken;
  
  beforeAll(async () => {
    // Login para obter token
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });
    
    const data = await response.json();
    sessionToken = data.data.sessionToken;
  });

  test('should create package', async () => {
    const packageData = {
      description: 'Test Package',
      weightGrams: 500,
      purchasePrice: 25.99,
      store: 'Test Store',
      orderNumber: 'TEST123',
      carrier: 'UPS',
      declaredValue: 25.99,
      packageType: 'BOX',
      lengthCm: 20,
      widthCm: 15,
      heightCm: 10
    };

    const response = await fetch('http://localhost:3000/api/packages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `session=${sessionToken}`
      },
      body: JSON.stringify(packageData)
    });

    const data = await response.json();
    expect(response.ok).toBe(true);
    expect(data.success).toBe(true);
    expect(data.data).toHaveProperty('id');
  });

  test('should list packages', async () => {
    const response = await fetch('http://localhost:3000/api/packages', {
      headers: { 'Cookie': `session=${sessionToken}` }
    });

    const data = await response.json();
    expect(response.ok).toBe(true);
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
  });
});
```

---

*Documentação de exemplos - Última atualização: Janeiro 2024*
