# 📚 Documentação da API - Euaconecta Platform

## 🚀 Início Rápido

Esta documentação fornece uma visão completa da API da Euaconecta Platform, incluindo todos os endpoints, exemplos de uso e especificações técnicas.

### 📁 Arquivos de Documentação

- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Documentação completa da API
- **[API_EXAMPLES.md](./API_EXAMPLES.md)** - Exemplos práticos e códigos de exemplo
- **[openapi.yaml](./openapi.yaml)** - Especificação OpenAPI/Swagger

### 🔧 Ferramentas Recomendadas

#### Para Desenvolvedores
- **Postman** - Para testar endpoints
- **Insomnia** - Alternativa ao Postman
- **Swagger UI** - Para visualizar a especificação OpenAPI

#### Para Integração
- **OpenAPI Generator** - Para gerar clientes SDK
- **Swagger Codegen** - Para gerar código cliente

---

## 🛠️ Configuração do Ambiente

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

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

### 3. Executar Migrações

```bash
npx prisma migrate dev
```

### 4. Iniciar Servidor

```bash
npm run dev
```

---

## 📖 Como Usar a Documentação

### 1. Documentação Completa
Consulte o arquivo `API_DOCUMENTATION.md` para:
- Lista completa de endpoints
- Parâmetros e respostas
- Códigos de status HTTP
- Estrutura de dados

### 2. Exemplos Práticos
Consulte o arquivo `API_EXAMPLES.md` para:
- Fluxos completos de uso
- Códigos de exemplo em JavaScript/TypeScript
- Códigos de exemplo em Python
- Tratamento de erros
- Testes automatizados

### 3. Especificação OpenAPI
Use o arquivo `openapi.yaml` para:
- Gerar clientes SDK automaticamente
- Visualizar no Swagger UI
- Integrar com ferramentas de desenvolvimento
- Validação de contratos

---

## 🔍 Visualizando a Especificação OpenAPI

### Opção 1: Swagger UI Online
1. Acesse [Swagger Editor](https://editor.swagger.io/)
2. Cole o conteúdo do arquivo `openapi.yaml`
3. Visualize a documentação interativa

### Opção 2: Swagger UI Local
1. Instale o Swagger UI:
```bash
npm install -g swagger-ui-serve
```

2. Execute o servidor:
```bash
swagger-ui-serve openapi.yaml
```

3. Acesse `http://localhost:3001`

### Opção 3: VS Code Extension
1. Instale a extensão "OpenAPI (Swagger) Editor"
2. Abra o arquivo `openapi.yaml`
3. Use o preview integrado

---

## 🧪 Testando a API

### 1. Usando cURL

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
```

### 2. Usando Postman

1. Importe a collection do arquivo `openapi.yaml`
2. Configure as variáveis de ambiente:
   - `base_url`: `http://localhost:3000`
   - `session_token`: `{{session_token}}`
3. Execute os testes

### 3. Usando JavaScript/TypeScript

```javascript
// Exemplo básico
const response = await fetch('http://localhost:3000/api/packages', {
  headers: {
    'Cookie': 'session=your_session_token'
  }
});

const data = await response.json();
console.log(data);
```

---

## 🔧 Gerando Clientes SDK

### JavaScript/TypeScript

```bash
# Instalar OpenAPI Generator
npm install -g @openapitools/openapi-generator-cli

# Gerar cliente JavaScript
openapi-generator-cli generate \
  -i openapi.yaml \
  -g javascript \
  -o ./generated/js-client

# Gerar cliente TypeScript
openapi-generator-cli generate \
  -i openapi.yaml \
  -g typescript-axios \
  -o ./generated/ts-client
```

### Python

```bash
# Gerar cliente Python
openapi-generator-cli generate \
  -i openapi.yaml \
  -g python \
  -o ./generated/python-client
```

### Java

```bash
# Gerar cliente Java
openapi-generator-cli generate \
  -i openapi.yaml \
  -g java \
  -o ./generated/java-client
```

---

## 📊 Monitoramento e Logs

### Logs da API
Todos os endpoints logam:
- Requisições recebidas
- Respostas enviadas
- Erros ocorridos
- Tempo de processamento

### Métricas Disponíveis
- Número de requisições por endpoint
- Tempo médio de resposta
- Taxa de erro por endpoint
- Uso de recursos

---

## 🚨 Tratamento de Erros

### Códigos de Status HTTP

| Código | Descrição | Ação Recomendada |
|--------|-----------|------------------|
| 200 | Sucesso | Continuar |
| 201 | Criado | Processar dados retornados |
| 400 | Requisição inválida | Verificar dados enviados |
| 401 | Não autenticado | Fazer login |
| 403 | Sem permissão | Verificar permissões |
| 404 | Não encontrado | Verificar ID do recurso |
| 409 | Conflito | Resolver conflito |
| 422 | Dados inválidos | Corrigir validação |
| 500 | Erro interno | Tentar novamente ou contatar suporte |

### Estrutura de Erro

```json
{
  "success": false,
  "error": "Mensagem de erro específica",
  "code": "ERROR_CODE",
  "details": {
    "field": "Campo com erro",
    "reason": "Motivo do erro"
  }
}
```

---

## 🔐 Segurança

### Autenticação
- Baseada em cookies de sessão
- Tokens JWT para APIs externas
- Rate limiting implementado

### Autorização
- Controle de acesso baseado em roles
- Middleware de autenticação
- Validação de permissões

### Dados Sensíveis
- Senhas hasheadas com bcrypt
- Dados de pagamento criptografados
- Logs não expõem informações sensíveis

---

## 📈 Performance

### Otimizações Implementadas
- Cache de consultas frequentes
- Paginação em listas grandes
- Compressão de respostas
- Índices de banco de dados

### Limites
- Rate limiting: 100 req/min por IP
- Upload máximo: 10MB por arquivo
- Timeout: 30 segundos por requisição
- Paginação: máximo 100 itens por página

---

## 🆘 Suporte

### Documentação
- Consulte os arquivos de documentação
- Verifique exemplos práticos
- Use a especificação OpenAPI

### Contato
- Email: suporte@euaconecta.com
- Sistema de tickets integrado
- Chat de suporte em tempo real

### Issues
- Reporte bugs via GitHub Issues
- Inclua logs e exemplos
- Descreva o comportamento esperado

---

## 📝 Changelog

### v1.0.0 (Janeiro 2024)
- ✅ Documentação completa da API
- ✅ Especificação OpenAPI
- ✅ Exemplos práticos
- ✅ Códigos de exemplo
- ✅ Guia de integração

---

## 🤝 Contribuindo

### Melhorias na Documentação
1. Fork do repositório
2. Crie uma branch para sua feature
3. Faça as alterações
4. Submeta um Pull Request

### Sugestões
- Adicione novos exemplos
- Melhore a clareza da documentação
- Corrija erros encontrados
- Adicione novos casos de uso

---

*Documentação mantida pela equipe Euaconecta - Última atualização: Janeiro 2024*
