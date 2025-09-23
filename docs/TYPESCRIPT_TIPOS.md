# Uso de Tipos em TypeScript: Evitando `any` no Projeto

## Visão Geral

Este documento estabelece diretrizes específicas para o uso adequado de tipos no TypeScript no projeto Plataforma EuaConecta, com foco especial em evitar o uso do tipo `any`. O objetivo é garantir segurança de tipos, melhor qualidade de código e facilitar a manutenção.

## 1. Por que Evitar o `any`

O tipo `any` efetivamente desativa a verificação de tipos do TypeScript, eliminando muitas das vantagens que o sistema de tipos oferece:

- Perde-se a autocompleção e ajuda do IDE
- Erros que poderiam ser detectados em tempo de compilação só aparecem em runtime
- Dificulta refatorações seguras
- Reduz a legibilidade e documentação do código
- Pode propagar-se pelo código, comprometendo partes não relacionadas

## 2. Regras para Uso de Tipos

### 2.1. Regra Geral

- **NUNCA** use `any` em código novo
- Desative a regra `noImplicitAny` no `tsconfig.json` para garantir que tipos implícitos `any` sejam identificados
- Use o linting para proibir `any` através da regra `@typescript-eslint/no-explicit-any`

### 2.2. Alternativas ao `any`

Em vez de usar `any`, utilize:

1. **`unknown`**: Quando não souber o tipo exato, mas quiser manter a segurança de tipo
2. **Tipos Genéricos**: Para criar componentes reutilizáveis que trabalham com múltiplos tipos
3. **Tipos de União**: Para representar múltiplos tipos possíveis
4. **Tipos de Interseção**: Para combinar tipos
5. **Tipos Record**: Para objetos com chaves dinâmicas
6. **Asserções de Tipo**: Quando tiver certeza do tipo real (com moderação)

## 3. Exemplos Práticos

### 3.1. Evite `any` em Parâmetros de Funções

```typescript
// ❌ Ruim: Usando any
function processData(data: any) {
  return data.value * 2; // Perigoso, data.value pode não existir ou não ser um número
}

// ✅ Bom: Tipo específico
function processData(data: { value: number }) {
  return data.value * 2;
}

// ✅ Bom: Usando genéricos quando necessário
function processGeneric<T extends { value: number }>(data: T) {
  return data.value * 2;
}
```

### 3.2. Tipagem de Dados de API

```typescript
// ❌ Ruim: Recebendo dados como any
async function fetchUser(id: string): Promise<any> {
  const response = await api.get(`/users/${id}`);
  return response.data;
}

// ✅ Bom: Definindo uma interface
interface IUser {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'CLIENT';
  createdAt: Date;
}

async function fetchUser(id: string): Promise<IUser> {
  const response = await api.get(`/users/${id}`);
  return response.data;
}
```

### 3.3. Uso de `unknown` em vez de `any`

```typescript
// ❌ Ruim: any permite operações inseguras sem verificação
function logData(data: any) {
  console.log(data.toString()); // Sem verificação se toString existe
}

// ✅ Bom: unknown força verificações em tempo de execução
function logData(data: unknown) {
  if (typeof data === 'object' && data !== null && 'toString' in data) {
    console.log(data.toString());
  } else {
    console.log(String(data));
  }
}
```

### 3.4. Objetos com Chaves Dinâmicas

```typescript
// ❌ Ruim: Objeto com chaves dinâmicas usando any
const cache: { [key: string]: any } = {};

// ✅ Bom: Usando Record
const cache: Record<string, unknown> = {};

// ✅ Melhor: Sendo específico sobre os valores
const cache: Record<string, string | number | boolean> = {};

// ✅ Ainda melhor: Usando genéricos
function createCache<T>(): Record<string, T> {
  return {};
}
const numberCache = createCache<number>();
```

### 3.5. Tipagem de Eventos

```typescript
// ❌ Ruim: Tratamento de evento com any
function handleClick(event: any) {
  event.preventDefault();
  console.log(event.target.value);
}

// ✅ Bom: Tipo específico para o evento
function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
  event.preventDefault();
  console.log(event.currentTarget.value);
}
```

### 3.6. Tipagem com Express

```typescript
// ❌ Ruim: Usar any para requisições Express
app.get('/users', (req: any, res: any) => {
  const userId = req.query.id;
  // ...
});

// ✅ Bom: Usar tipos específicos
import { Request, Response } from 'express';

app.get('/users', (req: Request, res: Response) => {
  const userId = req.query.id as string;
  // ...
});

// ✅ Ainda melhor: Estender tipos para incluir propriedades personalizadas
interface IAuthenticatedRequest extends Request {
  user: {
    id: string;
    role: string;
  };
}

app.get('/profile', (req: IAuthenticatedRequest, res: Response) => {
  const userId = req.user.id;
  // ...
});
```

## 4. Quando o uso de `any` é justificável (raro)

Existem raras situações onde o uso de `any` pode ser necessário:

1. **Interação com bibliotecas externas não tipadas**
   ```typescript
   // Melhor criar definições de tipos para a biblioteca
   // Se não for possível, isolar o uso de any em um único local
   import * as untypedLib from 'untyped-library';
   
   // Isole o any em uma função wrapper com tipos de saída claros
   function wrappedFunction(input: string): number {
     const result = (untypedLib as any).doSomething(input);
     return Number(result);
   }
   ```

2. **Casos onde a modelagem de tipo é extremamente complexa e não traz benefícios**
   ```typescript
   // Adicione comentários explicando por que any foi usado
   // E considere usar eslint-disable para esse caso específico
   // @ts-expect-error Explicação da razão para usar any aqui
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const complexData: any = JSON.parse(rawData);
   ```

## 5. Processo de Migração para Eliminar `any`

Para códigos existentes com uso de `any`:

1. **Identifique** todos os usos de `any` com `grep` ou ferramentas de análise estática
2. **Priorize** áreas críticas como interfaces de API e funções principais
3. **Refatore** gradualmente, testando cada mudança
4. **Documente** por que um `any` foi mantido, se absolutamente necessário
5. **Adicione testes** para garantir que a refatoração não quebrou funcionalidades

## 6. Recursos Adicionais

- [TypeScript Handbook - Advanced Types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)
- [Guia definitivo para evitar any](https://blog.logrocket.com/typescript-unknown-type-vs-any/)
- [Tipos utilitários do TypeScript](https://www.typescriptlang.org/docs/handbook/utility-types.html)