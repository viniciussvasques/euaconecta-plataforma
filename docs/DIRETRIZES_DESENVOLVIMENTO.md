# Diretrizes de Desenvolvimento - Projeto Plataforma EuaConecta

## Visão Geral

Este documento estabelece as diretrizes e práticas que devem ser seguidas durante o desenvolvimento do projeto Plataforma EuaConecta. O objetivo é garantir qualidade, consistência e manutenibilidade do código através de todo o projeto.

## 1. Estrutura do Projeto e Organização

### 1.1. Verificação de Estrutura

- **SEMPRE** verifique a estrutura existente do projeto antes de adicionar novos componentes
- Siga o padrão de organização estabelecido para diretórios e arquivos
- Mantenha a separação clara entre camadas (controllers, services, models, etc.)

### 1.2. Nomenclatura

- Utilize **camelCase** para nomes de variáveis, funções e propriedades
- Utilize **PascalCase** para classes, interfaces, tipos e enums
- Utilize **kebab-case** para nomes de arquivos e diretórios
- Prefixe interfaces com "I" (ex: `IUserService`)
- Sufixe types com "Type" (ex: `ResponseType`)
- Sufixe enums com "Enum" (ex: `StatusEnum`)

### 1.3. Módulos

- Organize código relacionado em módulos coesos
- Cada módulo deve estar em seu próprio diretório com estrutura consistente
- Exemplo de estrutura de módulo:
  ```
  src/modules/users/
  ├── controllers/
  ├── services/
  ├── repositories/
  ├── models/
  ├── schemas/
  ├── dto/
  ├── interfaces/
  ├── tests/
  └── i18n/
  ```

## 2. Código e Estilo

### 2.1. TypeScript

- Use tipos explícitos sempre que possível
- **NUNCA** use o tipo `any` em código novo (veja detalhes no documento [TYPESCRIPT_TIPOS.md](/docs/TYPESCRIPT_TIPOS.md))
- Utilize interfaces para definir contratos de funções e classes
- Prefixe interfaces com "I" (ex: `IUserService`)
- Aproveite recursos avançados do TypeScript como tipos genéricos quando apropriado
- Use `unknown` em vez de `any` quando o tipo não for conhecido em tempo de compilação
- Aplique tipos de união (`type | type`) quando um valor pode ter múltiplos tipos

### 2.2. Padrões de Código

- Siga o princípio SOLID
- Prefira composição sobre herança
- Use injeção de dependências para facilitar testes
- Mantenha funções pequenas e com responsabilidade única
- Limite complexidade ciclomática

### 2.3. Formatação

- Use ESLint e Prettier para garantir consistência de formatação
- Execute `npm run lint` e `npm run format` antes de cada commit
- Respeite os limites de comprimento de linha (100 caracteres)
- Use 2 espaços para indentação

## 3. Testes

### 3.1. Cobertura de Testes

- **TODA** nova funcionalidade deve incluir testes unitários
- Mantenha cobertura de testes acima de 80%
- Testes devem ser executados antes de cada PR e commit

### 3.2. Tipos de Testes

- **Testes Unitários**: Para funções e métodos isolados
- **Testes de Integração**: Para interações entre componentes
- **Testes E2E**: Para fluxos completos de usuário

### 3.3. Práticas de Teste

- Use AAA pattern (Arrange, Act, Assert)
- Mock dependências externas
- Um arquivo de teste por arquivo de código
- Testes devem ser independentes e não depender de estado compartilhado

## 4. Internacionalização (i18n)

### 4.1. Estrutura de Arquivos

- Todos os textos visíveis devem ser internacionalizados
- Arquivos de tradução devem estar em `/src/i18n/{locale}/`
- Categorize traduções por módulo/domínio

### 4.2. Nomenclatura de Chaves

- Use formato hierárquico: `{módulo}.{subcomponente}.{elemento}`
- Exemplo: `user.validation.emailRequired`
- Evite usar valores dinâmicos nas chaves

### 4.3. Idiomas Suportados

- Português (pt-BR) - Idioma padrão
- Inglês (en-US)
- Espanhol (es-ES)

### 4.4. Processo de Tradução

- Sempre defina traduções nos três idiomas simultaneamente
- Não deixe textos hardcoded no código
- Use variáveis de interpolação para valores dinâmicos

## 5. Controle de Versão

### 5.1. Convenção de Commits

- Siga o padrão [Conventional Commits](https://www.conventionalcommits.org/)
- Formato: `tipo(escopo opcional): mensagem`
- Tipos: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

### 5.2. Branches

- `main`: código em produção
- `develop`: código em desenvolvimento
- `feature/{nome-da-feature}`: para novas funcionalidades
- `bugfix/{nome-do-bug}`: para correções
- `release/{versão}`: para preparação de release

### 5.3. Pull Requests

- Descreva claramente as mudanças e o propósito
- Referencie issues relacionadas
- Garanta que todos os testes passem
- Obtenha pelo menos uma revisão antes do merge

## 6. Documentação

### 6.1. Código

- Use JSDoc para documentar funções, classes e métodos
- Descreva parâmetros, retornos e possíveis exceções
- Explique lógica complexa com comentários inline

### 6.2. APIs

- Documente todas as APIs com Swagger/OpenAPI
- Inclua exemplos de requisição e resposta
- Documente códigos de status e erros possíveis

### 6.3. Documentação de Projeto

- Mantenha README.md atualizado
- Documente arquitetura e decisões técnicas
- Mantenha guias para novos desenvolvedores

## 7. Registro de Progresso

### 7.1. Documento de Progresso

- Mantenha um documento `/docs/PROGRESS.md` atualizado
- Cada sessão de trabalho deve ser registrada
- Inclua: data, participantes, objetivos, realizações, próximos passos, problemas encontrados

### 7.2. Formato de Registro

```markdown
## Sessão [número] - [data]

### Participantes
- [nome]

### Objetivos
- [lista de objetivos]

### Realizações
- [lista de tarefas completadas]

### Problemas Encontrados
- [lista de problemas e soluções]

### Próximos Passos
- [lista de próximas ações]
```

## 8. Segurança

### 8.1. Boas Práticas

- Nunca armazene credenciais no código
- Use variáveis de ambiente para configurações sensíveis
- Valide todas as entradas de usuário
- Implemente rate limiting para APIs

### 8.2. Dependências

- Mantenha dependências atualizadas
- Execute análise de vulnerabilidades regularmente
- Prefira dependências bem mantidas e com boa segurança

## 9. Performance

### 9.1. Backend

- Otimize queries de banco de dados
- Implemente cache onde apropriado
- Use paginação para conjuntos grandes de dados
- Monitore tempo de resposta das APIs

### 9.2. Revisões de Performance

- Realize revisões de performance periódicas
- Identifique e corrija gargalos
- Use ferramentas de profiling quando necessário

## 10. Revisão de Código

### 10.1. Checklist de Revisão

- Código segue os padrões definidos?
- Existe documentação adequada?
- Os testes são suficientes e estão passando?
- O código é eficiente e legível?
- As traduções estão completas?
- Existem vulnerabilidades de segurança?

### 10.2. Processo de Revisão

- Revisor deve entender completamente as mudanças
- Fornecer feedback construtivo
- Verificar se atende aos requisitos
- Confirmar cobertura de testes

## Manutenção do Documento

Este documento deve ser revisado e atualizado regularmente conforme o projeto evolui e novas práticas são adotadas. Qualquer desenvolvedor pode propor alterações através de um pull request.