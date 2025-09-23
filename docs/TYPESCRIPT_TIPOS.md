# Melhores Práticas para Uso de Tipos no TypeScript

## Por Que Evitar o Uso de `any`?

O tipo `any` anula todas as vantagens do TypeScript:

1. **Perde a segurança de tipos**: Erros são descobertos em tempo de execução em vez de tempo de compilação
2. **Elimina o autocompletar e sugestões do editor**: O IntelliSense não funciona corretamente
3. **Prejudica a manutenibilidade**: Outros desenvolvedores não saberão como usar sua função/classe
4. **Propaga-se pelo código**: Um único `any` pode contaminar outras partes do código
5. **Dificulta refatorações**: Renomear propriedades ou métodos se torna inseguro

## Alternativas ao Uso do `any`

O TypeScript oferece diversas alternativas ao uso do tipo `any` que mantêm a segurança de tipos enquanto proporcionam a flexibilidade necessária:

### 1. Use `unknown` em vez de `any`

O tipo `unknown` é chamado de "any seguro". Ele aceita qualquer valor, mas você precisa verificar o tipo antes de usar:

```typescript
// Ruim
function processData(data: any) {
  return data.length; // Nenhuma verificação, pode falhar em runtime
}

// Bom
function processData(data: unknown) {
  if (typeof data === 'string' || Array.isArray(data)) {
    return data.length; // TypeScript sabe que length existe aqui
  }
  return 0;
}
```

### 2. Type Guards: Verificação de Tipos em Runtime

Crie funções que validam e refinam tipos:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

// Type guard para verificar se um objeto é um User
function isUser(obj: unknown): obj is User {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'name' in obj &&
    'email' in obj &&
    typeof obj.id === 'number' &&
    typeof obj.name === 'string' &&
    typeof obj.email === 'string'
  );
}

function processUserData(data: unknown) {
  if (isUser(data)) {
    // TypeScript sabe que data é do tipo User aqui
    console.log(`Usuário: ${data.name} (${data.email})`);
    return;
  }
  
  console.log('Dados inválidos');
}
```

### 3. Tipos de União

Quando um valor pode ser de vários tipos diferentes:

```typescript
// Em vez de any, seja específico sobre quais tipos são aceitos
function formatValue(value: string | number | boolean | null): string {
  if (value === null) return 'N/A';
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toFixed(2);
  return value ? 'Sim' : 'Não';
}
```

### 4. Tipos Genéricos

Para criar componentes reutilizáveis que preservam os tipos:

```typescript
// API Client genérico
async function fetchApi<T>(url: string): Promise<T> {
  const response = await fetch(url);
  return response.json() as Promise<T>;
}

// Uso com tipos específicos
interface Product {
  id: string;
  name: string;
  price: number;
}

// TypeScript sabe que products é um array de Product
const products = await fetchApi<Product[]>('/api/products');
```

### 5. Record, Partial e Outros Tipos Utilitários

Para objetos com estrutura dinâmica:

```typescript
// Objeto com chaves string e valores dinâmicos mas tipados
type ConfigValue = string | number | boolean;
const config: Record<string, ConfigValue> = {
  apiUrl: 'https://api.example.com',
  timeout: 3000,
  enableCache: true
};

// Para atualizações parciais
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

function updateUser(userId: number, updates: Partial<User>): void {
  // updates pode ter apenas algumas propriedades de User
}

updateUser(123, { name: 'Novo Nome' }); // Válido
```

### 6. Tipos Indexados

Para acessar propriedades de maneira segura:

```typescript
interface ApiResponse {
  data: {
    users: Array<{
      id: number;
      name: string;
      settings: {
        theme: 'light' | 'dark';
        notifications: boolean;
      }
    }>
  }
}

// Em vez de usar any, use tipos indexados
type UserSettings = ApiResponse['data']['users'][0]['settings'];

function processUserSettings(settings: UserSettings) {
  // TypeScript conhece a estrutura exata de settings
}
```

## Quando usar `any` (casos muito raros)

O tipo `any` deve ser evitado em código novo. Os únicos casos aceitáveis são:

1. **Migrações** de JavaScript para TypeScript (temporariamente, com plano de refatoração)
2. **Integrações** com bibliotecas sem tipos (mas neste caso, crie seus próprios types!)
3. **Teste unitários** onde a tipagem exata não é relevante para o teste

Em vez de `any`, prefira:

```typescript
// 1. Comentários para ignorar erros específicos (melhor que 'any')
// @ts-expect-error Explicar por que isso é necessário
// @ts-ignore Explicar por que isso é necessário

// 2. Criar tipos para bibliotecas externas
declare module 'biblioteca-sem-tipos' {
  export function algumMetodo(param: string): number;
}
```

## Exemplos de Refatoração

### Exemplo 1: Dados de API

**Antes (ruim):**
```typescript
function processApiResponse(data: any) {
  return {
    id: data.id,
    name: data.name,
    items: data.items || []
  };
}
```

**Depois (bom):**
```typescript
interface ApiResponse {
  id: number;
  name: string;
  items?: string[];
}

function processApiResponse(data: ApiResponse) {
  return {
    id: data.id,
    name: data.name,
    items: data.items || []
  };
}
```

### Exemplo 2: Funções de Manipulação de Eventos

**Antes (ruim):**
```typescript
function handleEvent(event: any) {
  if (event.type === 'click') {
    console.log(`Clicou em ${event.target.id}`);
  }
}
```

**Depois (bom):**
```typescript
type ClickEvent = {
  type: 'click';
  target: { id: string; [key: string]: any };
};

type KeyboardEvent = {
  type: 'keydown' | 'keyup';
  key: string;
};

type AppEvent = ClickEvent | KeyboardEvent;

function handleEvent(event: AppEvent) {
  if (event.type === 'click') {
    // TypeScript sabe que event é ClickEvent aqui
    console.log(`Clicou em ${event.target.id}`);
  }
}
```

### Exemplo 3: Dados Dinâmicos de Configuração

**Antes (ruim):**
```typescript
function initializeApp(config: any) {
  const apiUrl = config.api?.url || 'https://default-api.com';
  const timeout = config.timeouts?.request || 5000;
}
```

**Depois (bom):**
```typescript
interface AppConfig {
  api?: {
    url: string;
    version?: string;
  };
  timeouts?: {
    request?: number;
    session?: number;
  };
  features?: Record<string, boolean>;
}

function initializeApp(config: AppConfig) {
  const apiUrl = config.api?.url || 'https://default-api.com';
  const timeout = config.timeouts?.request || 5000;
}
```

## Melhores Práticas para o Projeto

1. **Configure o ESLint**: Use a regra `@typescript-eslint/no-explicit-any` para proibir o uso de `any`
2. **Configure o tsconfig.json**: Use `"noImplicitAny": true` para evitar tipos implícitos
3. **Crie tipos para APIs externas**: Defina interfaces para todas as APIs que você consome
4. **Use bibliotecas de tipos**: Como `zod` para validar dados externos em runtime
5. **Documente os tipos complexos**: Adicione comentários JSDoc para explicar tipos complexos

## Recursos Úteis

- [TypeScript Handbook - Tipos Básicos](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
- [TypeScript Handbook - Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [TypeScript Handbook - Tipos Utilitários](https://www.typescriptlang.org/docs/handbook/utility-types.html)
- [Zod - Biblioteca de validação de esquemas TypeScript](https://github.com/colinhacks/zod)