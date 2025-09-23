# Mapeamento de Funcionalidades - Painel Administrativo

## Visão Geral do Painel Administrativo

Este documento mapeia todas as funcionalidades disponíveis no painel administrativo do projeto original EuaConecta. O objetivo é garantir que todas estas funcionalidades sejam devidamente implementadas no novo projeto.

## 1. Dashboard Principal (`/admin`)

- Visão geral do sistema com métricas principais
- Gráficos de desempenho e atividade recente
- Alertas e notificações importantes
- Links rápidos para as principais funções

## 2. Gerenciamento de Usuários (`/admin/users`)

- Listagem de todos os usuários com filtros e paginação
- Criação, edição e desativação de usuários
- Atribuição de funções e permissões
- Visualização de atividades e histórico do usuário
- Redefinição de senha
- Bloqueio/desbloqueio de contas

## 3. Gerenciamento de Pacotes (`/admin/packages`)

- Listagem de todos os pacotes com filtros avançados
- Criação e edição de pacotes
- Atualização de status (PENDING, RECEIVED, READY_TO_SHIP, SHIPPED)
- Associação de pacotes a usuários
- Rastreamento de pacotes recebidos
- Adição de notas e observações

## 4. Gerenciamento de Envios (`/admin/shipments`)

- Listagem de envios com filtros por status, usuário, data
- Criação e edição de envios
- Geração de etiquetas de envio
- Atualização de status de envio
- Seleção de transportadoras e serviços
- Cálculo de custos de envio
- Visualização de rastreamento

## 5. Gerenciamento de Consolidação (`/admin/consolidation`)

- Listagem de consolidações em andamento e concluídas
- Criação de novas consolidações
- Adição/remoção de pacotes em uma consolidação
- Opções de reembalagem e proteção especial
- Cálculo de peso volumétrico e taxa de consolidação
- Atualização de status de consolidação

## 6. Gerenciamento de Pagamentos (`/admin/payments`)

- Visualização de histórico de pagamentos
- Filtros por usuário, status, método de pagamento
- Confirmação manual de pagamentos
- Emissão de reembolsos
- Exportação de relatórios financeiros
- Visualização de transações pendentes

## 7. Configurações de Integração (`/admin/integrations`)

- Configuração de integrações com transportadoras (USPS, FedEx, DHL)
- Configuração de gateways de pagamento (Stripe, PayPal)
- Configuração de serviços de email
- Testes de integração
- Logs de comunicação com serviços externos

## 8. Gerenciamento de Armazenamento (`/admin/storage`)

- Visualização de itens em armazenamento
- Definição de políticas de armazenamento
- Configuração de taxas de armazenamento
- Alertas de itens próximos do limite de armazenamento
- Relatórios de ocupação de espaço

## 9. Gerenciamento de Transportadoras (`/admin/carriers`)

- Cadastro e edição de transportadoras
- Configuração de serviços disponíveis por transportadora
- Definição de regras de preço e markup
- Ativação/desativação de transportadoras
- Configuração de rastreamento

## 10. Gerenciamento de Depósitos (`/admin/warehouses`)

- Cadastro e edição de depósitos
- Configuração de endereços e contatos
- Definição de capacidades e serviços disponíveis
- Monitoramento de ocupação

## 11. Configurações do Sistema (`/admin/platform-config`)

- Configuração de informações da empresa
- Definição de taxas e cobranças padrão
- Configuração de políticas de negócio
- Configuração de notificações do sistema
- Personalização de aparência e emails

## 12. Gerenciamento de Conteúdo (`/admin/cms`)

- Gestão de páginas do site
- Edição de textos e imagens
- Personalização de emails e notificações
- Gestão de FAQs
- Configuração de termos de serviço e políticas

## 13. SEO e Marketing (`/admin/seo`)

- Configuração de meta tags
- Gerenciamento de sitemap.xml
- Configuração de robots.txt
- Integração com Google Analytics
- Monitoramento de desempenho SEO

## 14. Blog e Tutoriais (`/admin/blog` e `/admin/tutorials`)

- Criação e edição de posts do blog
- Categorização de conteúdo
- Upload de imagens
- Criação e gestão de tutoriais para clientes
- Agendamento de publicações

## 15. Depoimentos e Parceiros (`/admin/testimonials` e `/admin/partners`)

- Gerenciamento de depoimentos de clientes
- Aprovação de novos depoimentos
- Cadastro e edição de parceiros
- Configuração de logos e links

## 16. Suporte ao Cliente (`/admin/support`)

- Visualização e resposta a tickets de suporte
- Priorização de tickets
- Atribuição de tickets a agentes
- Histórico de comunicações
- Estatísticas de atendimento

## 17. Relatórios e Análises (`/admin/reports`)

- Geração de relatórios operacionais
- Análise de desempenho financeiro
- Estatísticas de envio e rastreamento
- Exportação de dados em diferentes formatos (CSV, Excel)
- Dashboards personalizáveis

## 18. Logs e Monitoramento (`/admin/logs`)

- Visualização de logs do sistema
- Monitoramento de erros e exceções
- Auditoria de ações dos usuários
- Alertas de problemas no sistema
- Histórico de operações críticas

## 19. Gerenciamento de Notificações (`/admin/notifications`)

- Configuração de canais de notificação (email, SMS, in-app)
- Criação de modelos de notificação
- Envio de notificações em massa
- Teste de notificações
- Histórico de notificações enviadas

## 20. Segurança e Acesso (`/admin/roles`)

- Definição de funções e permissões
- Controle granular de acesso a recursos
- Políticas de senha e segurança
- Monitoramento de sessões ativas
- Configuração de autenticação em dois fatores