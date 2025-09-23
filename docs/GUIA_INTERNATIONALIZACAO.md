# Guia de Internacionalização (i18n)

Este guia descreve como usar o sistema de internacionalização implementado no projeto Plataforma EuaConecta.

## Visão Geral

O sistema de internacionalização (i18n) permite que a aplicação seja facilmente traduzida para múltiplos idiomas, atualmente:

- Português (pt) - idioma padrão
- Inglês (en)
- Espanhol (es)

A implementação utiliza o pacote `i18next` com suporte a backend baseado em arquivos e middleware HTTP para detecção automática de idioma.

## Estrutura de Arquivos

```
/src/locales/         # Diretório principal com arquivos de tradução
  /pt/                # Traduções em português (padrão)
    translation.json  # Arquivo principal de traduções
  /en/                # Traduções em inglês
    translation.json
  /es/                # Traduções em espanhol
    translation.json

/src/infrastructure/i18n/     # Configuração de internacionalização
  i18nConfig.ts              # Configurações e utilitários

/src/infrastructure/middleware/  # Middlewares relacionados
  validationMiddleware.ts       # Middleware de validação com i18n
```

## Arquivos de Tradução

Os arquivos de tradução seguem a estrutura JSON do i18next, com chaves organizadas hierarquicamente:

```json
{
  "translation": {
    "namespace": {
      "chave": "Valor traduzido"
    }
  }
}
```

## Como Usar

### Em Rotas Express

Nas rotas Express, o objeto de requisição (`req`) é automaticamente enriquecido com métodos de tradução:

```typescript
app.get('/exemplo', (req, res) => {
  const mensagemTraduzida = req.t('namespace.chave');
  
  res.json({
    mensagem: mensagemTraduzida,
    idioma: req.language
  });
});
```

### Em Middlewares

Utilize o método `translateErrorMessage` para traduzir mensagens em middlewares:

```typescript
import { translateErrorMessage } from '../i18n/i18nConfig';

export const meuMiddleware = (req, res, next) => {
  const mensagemErro = translateErrorMessage('errors.naoAutorizado', {}, req);
  
  // Uso da mensagem traduzida
  return res.status(401).json({ message: mensagemErro });
};
```

### Em Serviços ou Classes

Para contextos não relacionados a HTTP (serviços, classes, etc.), utilize o hook `useTranslation`:

```typescript
import { useTranslation } from '../infrastructure/i18n/i18nConfig';

export class MeuServico {
  private enviarEmail(usuario, assunto) {
    // Obter tradutor para o idioma preferido do usuário
    const { t } = useTranslation(usuario.idioma || 'pt');
    
    const assuntoEmail = t('emails.boasVindas.assunto', { nome: usuario.nome });
    const corpoEmail = t('emails.boasVindas.corpo', { nome: usuario.nome });
    
    // Lógica para envio de email
  }
}
```

## Interpolação de Valores

É possível inserir valores dinâmicos nas traduções usando a sintaxe de chaves duplas:

No arquivo de tradução:
```json
{
  "translation": {
    "saudacao": "Olá, {{nome}}!"
  }
}
```

No código:
```typescript
const mensagem = req.t('saudacao', { nome: 'Maria' });
// Resultado: "Olá, Maria!"
```

## Pluralização

Para traduzir textos com pluralização:

No arquivo de tradução:
```json
{
  "translation": {
    "itens": {
      "one": "{{count}} item",
      "other": "{{count}} itens"
    }
  }
}
```

No código:
```typescript
const umItem = req.t('itens', { count: 1 });     // "1 item"
const variosItens = req.t('itens', { count: 5 }); // "5 itens"
```

## Detecção de Idioma

O sistema detecta automaticamente o idioma preferido do usuário através de:

1. Cabeçalho HTTP `Accept-Language`
2. Parâmetro de query `lng`
3. Cookie `i18next`

Também é possível definir manualmente o idioma:

```typescript
// Em contextos HTTP
app.use((req, res, next) => {
  if (req.user && req.user.preferredLanguage) {
    req.language = req.user.preferredLanguage;
  }
  next();
});

// Em contextos não-HTTP
import { useTranslation } from '../infrastructure/i18n/i18nConfig';

const { i18n } = useTranslation();
i18n.changeLanguage('en');
```

## Middleware de Validação

O middleware de validação integra-se com o Joi para fornecer mensagens de erro traduzidas:

```typescript
import { validate } from '../infrastructure/middleware/validationMiddleware';
import { loginSchema } from './validation';

router.post('/login', validate(loginSchema), (req, res) => {
  // Lógica de login
});
```

## Adicionando Novos Idiomas

Para adicionar um novo idioma:

1. Crie um diretório com o código do idioma em `/src/locales/` (ex: `/src/locales/fr/`)
2. Crie um arquivo `translation.json` com as traduções
3. Adicione o idioma à lista de idiomas suportados em `i18nConfig.ts`:

```typescript
// Em i18nConfig.ts
supportedLngs: ['pt', 'en', 'es', 'fr']
```

## Boas Práticas

1. **Organização**: Mantenha as chaves de tradução organizadas por contexto ou funcionalidade
2. **Consistência**: Use convenções consistentes para nomear as chaves (ex: camelCase)
3. **Contexto**: Prefixe as chaves com o contexto (`user.name` em vez de apenas `name`)
4. **Comentários**: Adicione comentários nos arquivos de tradução para chaves que possam ser ambíguas
5. **Ferramentas**: Utilize ferramentas para detectar chaves de tradução ausentes

## Testes

Para testar a internacionalização, você pode:

1. Acessar a rota de teste `/api/test-i18n` com diferentes cabeçalhos `Accept-Language`
2. Utilizar a query string para forçar um idioma específico (ex: `/api/status?lng=es`)

## Recursos Adicionais

- [Documentação oficial do i18next](https://www.i18next.com/)
- [i18next-http-middleware](https://github.com/i18next/i18next-http-middleware)
- [i18next-fs-backend](https://github.com/i18next/i18next-fs-backend)