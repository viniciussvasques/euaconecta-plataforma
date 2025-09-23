
Guia de Regras para Criação de Arquivos – Projeto Plataforma EuaConecta

Este documento estabelece regras obrigatórias que devem ser seguidas antes da criação de qualquer arquivo pela IA ou por desenvolvedores.
O objetivo é eliminar redundâncias, evitar código duplicado, manter padrões corretos e garantir consistência em todo o projeto.

> **Referências rápidas:**
> - [Diretrizes de Desenvolvimento](../../docs/DIRETRIZES_DESENVOLVIMENTO.md)
> - [Próximos Passos](../../docs/PROXIMOS_PASSOS.md)
> - [Registro de Progresso](../../docs/PROGRESS.md)
> - [Mapeamento APIs](../../docs/MAPEAMENTO_APIS_ORIGINAL.md)
> - [Estratégia Migração BD](../../docs/ESTRATEGIA_MIGRACAO_BD.md)
> - [Validação Migração BD](../../docs/VALIDACAO_MIGRACAO_BD.md)
## Atualização Contínua

- O arquivo `/docs/PROGRESS.md` **deve ser atualizado a cada sessão de trabalho** ou alteração relevante.
- Sempre registre links para documentos relacionados ao progresso, problemas e soluções.
- Marque tarefas concluídas nos documentos de próximos passos.
- Adicione exemplos práticos de uso de middlewares, internacionalização e fluxos híbridos na documentação técnica.
- Documente problemas encontrados e soluções adotadas.

## Mapeamento de Funcionalidades e APIs

- O mapeamento completo de funcionalidades, APIs, modelos e fluxos está disponível em:
  - `/docs/MAPEAMENTO_APIS_ORIGINAL.md`
  - `/docs/MAPEAMENTO_FUNCIONALIDADES_ADMIN.md`
  - `/docs/MAPEAMENTO_FUNCIONALIDADES_CLIENTE.md`
  - `/docs/MAPEAMENTO_MODELOS_DADOS.md`
- Antes de iniciar a migração de qualquer item, consulte o mapeamento correspondente.
- Cada funcionalidade migrada deve ser marcada como concluída em um checklist no `/docs/PROGRESS.md`.
- O checklist deve ser atualizado a cada item migrado, garantindo rastreabilidade e controle do progresso.
## Referências e Navegação

- Sempre adicione links entre documentos técnicos, mapeamentos, diretrizes e progresso para facilitar navegação e rastreabilidade.
## Checklist de Documentação

- Antes de criar ou atualizar arquivos, verifique se há documentação correspondente e mantenha os links atualizados.
- Utilize o checklist de funcionalidades migradas no `/docs/PROGRESS.md` para marcar cada item concluído.
- O checklist deve ser granular, permitindo marcar cada rota, serviço, middleware, modelo, componente ou hook migrado.

## Execução Sequencial das Etapas

- O desenvolvedor (IA ou humano) pode executar as etapas do checklist uma a uma, sem necessidade de aprovação manual a cada passo.
- Siga sempre as boas práticas, checklist e regras do projeto.
- Só interrompa o fluxo em caso de dúvida crítica, decisão estratégica ou erro impeditivo.

## Verificação de Erros

- Após criar ou editar qualquer arquivo, **sempre execute a verificação de erros de lint e compilação**.
- Corrija imediatamente qualquer erro encontrado antes de prosseguir para o próximo passo.
## Cobertura de Testes e Documentação

- Cobertura mínima de testes: 80%.
- Documentação JSDoc obrigatória para funções/métodos públicos.
## Internacionalização

- **OBRIGATÓRIO**: Nenhum texto hardcoded em qualquer parte do código. Sempre usar chaves i18n para todas as mensagens, respostas, erros, validações e textos exibidos ao usuário.
- Aplicar i18n em: respostas de API, mensagens de erro, validações, logs de usuário, e-mails, notificações e qualquer texto que possa ser visto pelo usuário final.
- Documente exemplos de uso e estrutura dos arquivos de tradução.
- Suporte obrigatório aos três idiomas: português (pt), inglês (en) e espanhol (es).
- Use `req.t('chave.i18n')` em controllers e services para traduzir mensagens baseadas no idioma da requisição.
- Para contextos não-HTTP, use `useTranslation(idioma)` do utilitário i18n.
## Segurança

- Documente como configurar secrets no GitHub Actions para evitar dúvidas sobre avisos locais.
## Fluxo de PR/Deploy

- Siga o checklist de PR/Deploy do `/docs/PROGRESS.md` antes de cada commit ou merge.

1. Estrutura e Organização
1.1. Estrutura Geral do Projeto
src/
├── config/           # Configurações globais (env, db, logger, cache)
├── modules/          # Cada módulo isolado (user, auth, product, etc.)
│   ├── controllers/  # REST Controllers
│   ├── resolvers/    # GraphQL Resolvers
│   ├── services/     # Regras de negócio
│   ├── repositories/ # Acesso a banco/dados externos
│   ├── models/       # Modelos de ORM/ODM
│   ├── dto/          # Data Transfer Objects
│   ├── interfaces/   # Contratos/interfaces
│   ├── schemas/      # Schemas GraphQL e validações
│   ├── tests/        # Testes unitários e integração
│   └── i18n/         # Traduções específicas do módulo
├── shared/           # Utilitários comuns
│   ├── utils/
│   ├── middlewares/
│   ├── constants/
│   ├── errors/
│   └── types/
└── index.ts          # Ponto de entrada principal

1.2. Estrutura REST (API Hash)

Controller: recebe requisição, valida input, chama service.

Service: contém lógica de negócio.

Repository: abstrai acesso a banco/dados externos.

DTO: define contratos de entrada/saída.

📌 Exemplo:

// src/modules/users/controllers/user.controller.ts
import { Request, Response } from 'express';
import { userService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';

export class UserController {
  async create(req: Request, res: Response) {
    const dto: CreateUserDto = req.body;
    const user = await userService.create(dto);
    return res.status(201).json(user);
  }
}

1.3. Estrutura GraphQL

Schema: define types, queries, mutations.

Resolver: implementa lógica para cada query/mutation.

Service: reaproveitado entre REST e GraphQL.

📌 Exemplo:

// src/modules/users/schemas/user.schema.ts
import { gql } from 'apollo-server-express';

export const userTypeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  input CreateUserInput {
    name: String!
    email: String!
    password: String!
  }

  type Query {
    users: [User!]!
  }

  type Mutation {
    createUser(input: CreateUserInput!): User!
  }
`;

// src/modules/users/resolvers/user.resolver.ts
import { userService } from '../services/user.service';

export const userResolvers = {
  Query: {
    users: () => userService.findAll(),
  },
  Mutation: {
    createUser: (_: unknown, { input }: { input: any }) =>
      userService.create(input),
  },
};

2. Regras de Criação de Arquivos
2.1. Antes de Criar um Arquivo

Verificar se já existe algo semelhante no projeto.

Se sim → reutilizar ou estender, nunca duplicar.

Confirmar local correto seguindo a estrutura de módulos.

Definir responsabilidade única do arquivo.

Se tiver mais de uma responsabilidade → dividir.

Nomear corretamente:

camelCase → variáveis/funções/propriedades

PascalCase → classes/interfaces/enums

kebab-case → arquivos/diretórios

2.2. Evitando Problemas

❌ Não duplicar funções utilitárias → colocar em shared/utils/.

❌ Não repetir tipos → mover para shared/types/.

❌ Não duplicar erros → padronizar em shared/errors/AppError.ts.

✅ Sempre criar testes junto com o arquivo (.spec.ts).

✅ Documentar com JSDoc cada função/método público.

3. API Híbrida (REST + GraphQL)
3.1. Padrões REST

Endpoints devem usar plural (/users, /products).

Use versão no path (/api/v1/users).

Retornos padronizados:

interface ResponseType<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
  };
}

3.2. Padrões GraphQL

Queries apenas para leitura.

Mutations apenas para escrita.

Paginação obrigatória para listas grandes.

Fragments para reuso de seleções.

4. Testes
4.1. Estrutura de Testes
src/modules/users/tests/
├── user.controller.spec.ts
├── user.service.spec.ts
└── user.resolver.spec.ts

4.2. Regras

Cada novo arquivo → arquivo de teste correspondente.

Cobertura mínima: 80%.

Usar AAA: Arrange → Act → Assert.

📌 Exemplo:

import { userService } from '../services/user.service';

describe('UserService', () => {
  it('should create a user', async () => {
    const user = await userService.create({
      name: 'John',
      email: 'john@test.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
  });
});

5. Internacionalização (i18n)

Nenhum texto hardcoded → sempre usar chave i18n.

Arquivos em /src/i18n/{locale}/.

Estrutura:

// src/i18n/en-US/users.json
{
  "validation": {
    "emailRequired": "Email is required",
    "invalidPassword": "Password is invalid"
  }
}

6. Segurança

Nunca salvar credenciais em código.

Usar variáveis de ambiente (process.env).

Todas entradas validadas via DTO/Schema.

Hash de senhas com argon2 ou bcrypt.

Rate limiting em REST e GraphQL.

7. Checklist Antes do Commit

 Nome do arquivo segue convenção

 Arquivo criado no diretório correto

 Sem duplicação de código

 Testes implementados

 i18n aplicado a todas as mensagens/respostas/erros

 Tipagem forte (sem any)

 Documentação JSDoc

 Lint + format passaram

 Cobertura de testes ≥ 80%

8. Exemplo de Fluxo Híbrido (REST + GraphQL)

📌 REST:

POST /api/v1/users
{
  "name": "John",
  "email": "john@test.com",
  "password": "123456"
}


📌 GraphQL:

mutation {
  createUser(input: { name: "John", email: "john@test.com", password: "123456" }) {
    id
    name
    email
  }
}