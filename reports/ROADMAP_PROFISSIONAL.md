# Roadmap Profissional — EuaConecta

## 1) Visão Geral
- Plataforma de consolidação e envio de pacotes (cliente e admin).
- Stack: Next.js 15 (App Router, TS), API Routes, Prisma + Postgres, Tailwind + ShadCN.

## 2) Funcionalidades Implementadas
- Autenticação por sessão (login/logout), cookie seguro.
- Usuários: suite automática, perfil (CPF/telefone), busca básica.
- Endereços: CRUD completo, endereço padrão; uso no perfil e consolidação.
- Pacotes (cliente/admin): listar, criar, editar, remover, detalhes, etiquetas PDF.
- Consolidação: abrir/gerenciar/fechar/consolidar; itens adicionais; taxas configuráveis.
- Envios: listagem com filtros; dados principais.
- Transportadoras: CRUD básico.
- Configurações da plataforma: markup, taxas e opções gerais.
- Relatórios/etiquetas: pacote e consolidação (PDF/Barcode).

## 3) Funcionalidades Implementadas (Atualizadas)
- ✅ Fluxo PENDENTE → RECEBIDO com confirmação (peso/foto) — completo.
- ✅ Integração final do cálculo de frete no fechamento/consolidação — completo.
- ✅ Sistema de upload de fotos (S3/MinIO) — completo.
- ✅ Sistema de notificações in-app — completo.
- ✅ Campo de rastreio na consolidação — completo.
- ✅ Sistema de provedores de pagamento — completo.

## 4) Funcionalidades Faltantes (Opcionais para Profissional)
- Segurança/Compliance: rate limiting, 2FA opcional, política de senha, locking, auditoria completa.
- ShipStation: cotação em tempo real, geração de etiqueta, tracking e webhooks.
- Observabilidade: logs estruturados (Logtail), rastreamento de erros (Sentry), alertas.
- Performance/Resiliência: cache (ISR/Redis), filas/jobs (imagens, PDFs, emails), retry/backoff.
- Testes: unit (serviços), integração (APIs), e2e (fluxos críticos); CI (lint, typecheck, tests).
- i18n/Finanças: internacionalização, moedas configuráveis, impostos regionais.
- RBAC avançado: permissões granulares por feature/rota, auditoria de acesso.
- DevOps: Docker Compose completo (app+db+s3), seeds determinísticos, staging, migrações automatizadas.

## 5) Melhorias “não obrigatórias” que elevam o produto
- UX
  - Auto-save e estados de rascunho em formulários longos.
  - Undo/redo para remoção de pacotes da caixa.
  - Skeletons e otimizações de carregamento (LCP/INP), `<Image>` em vez de `<img>`.
  - Tema claro/escuro; preferências persistidas por usuário.
  - Atalhos de teclado (ex.: abrir busca, confirmar ações) e tooltips consistentes.
- Operacional
  - Logs de auditoria visuais no admin (timeline por entidade).
  - Comentários/anotações internas por pacote/caixa/usuário.
  - Exportação CSV/XLS de listas e relatórios.
  - Webhooks internos para integrações futuras (ERP/BI).
- Dados
  - Métricas de negócio (lead time, taxa de reembalagem, custo médio/kg, CAC/LTV).
  - Painel de insights no admin (gráficos e coortes simples).
- Acessibilidade
  - Navegação por teclado e ARIA labels nos modais e formulários.
  - Contraste e tamanho de fonte ajustáveis.
- Confiabilidade
  - Página de status (health checks), página de manutenção.
  - Backups automáticos do Postgres e restore testado.

## 6) Checklists de QA (por área)
- Autenticação
  - Login válido, inválido, lock por tentativas.
  - Logout limpa sessão, expiração de cookie.
- Endereços
  - CRUD completo; definição de padrão; uso na consolidação/perfil.
- Pacotes
  - Criação/edição; mudança PENDENTE→RECEBIDO; etiqueta PDF; busca/filtro.
- Consolidações
  - Abrir/gerir/fechar; cálculo de taxas; integração de frete; relatório final.
- Pagamentos
  - Checkout ok/cancel; webhook pago/estornado; reconciliação no banco.
- Envios
  - Cotação, criação, status; rastreamento e prazos; impressão de etiqueta.

## 7) Riscos & Mitigações
- DB fora do ar → health check + retry + mensagens amigáveis.
- Falhas em APIs externas → filas com retry/backoff; circuit breaker básico.
- Corrupção de dados (edições concorrentes) → versionamento otimista / updatedAt checks.

## 8) Plano de Execução (Concluído)
✅ 1. Limpeza ESLint (<Image>, imports, hooks) e unificação enums Role/UserRole.
✅ 2. Integração FreightCalculator no fluxo de consolidação (cotação e confirmação).
✅ 3. Upload S3 (confirmação de pacote) com presigned URL.
✅ 4. Sistema de notificações in-app completo.
✅ 5. Campo de rastreio na consolidação.
✅ 6. Sistema de provedores de pagamento (Stripe, PayPal, PIX, Boleto).
⏳ 7. ShipStation: cotação, etiqueta, tracking + webhooks.
⏳ 8. Logs/erros: Logtail + Sentry + alertas.
⏳ 9. Cache/ISR e fila (BullMQ) para PDFs/imagens/emails.
⏳ 10. Testes unit/integration/e2e + CI.
⏳ 11. i18n e moedas/impostos configuráveis.
⏳ 12. RBAC avançado e perfis de permissão.
⏳ 13. Docker Compose completo + staging + seeds determinísticos.

## 9) Operação (Windows/Docker/Prisma)
```powershell
cd C:\\Euaconecta\\euaconecta-platform\\docker
docker compose up -d
cd C:\\Euaconecta\\euaconecta-platform
npx prisma migrate deploy
npx prisma generate
node .\\scripts\\create-users.js # seed opcional
```

## 10) Credenciais de teste (seed)
- Admin: `admin@euaconecta.com` / `admin123`
- Cliente: `cliente@teste.com` / `cliente123` (suite 2351)


