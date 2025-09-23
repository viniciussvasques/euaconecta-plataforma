#!/bin/bash

# Script para limpeza e reorganização da documentação
# Data: 21/09/2025

echo "🧹 Iniciando limpeza da documentação obsoleta..."

# Criar pasta de arquivo para documentos antigos
mkdir -p docs/archive/$(date +%Y%m%d)
mkdir -p reports/archive/$(date +%Y%m%d)

echo "📁 Movendo documentos obsoletos para arquivo..."

# Mover documentos obsoletos do reports/
mv reports/AUDITORIA_COMPLETA_SISTEMA.md reports/archive/$(date +%Y%m%d)/ 2>/dev/null
mv reports/RELATORIO_COMPLETO_SISTEMA.md reports/archive/$(date +%Y%m%d)/ 2>/dev/null
mv reports/SISTEMA_COMPLETO_ANALISE.md reports/archive/$(date +%Y%m%d)/ 2>/dev/null
mv reports/analise-concorrencia-uscloser.md reports/archive/$(date +%Y%m%d)/ 2>/dev/null
mv reports/analise-warnings-detalhada.md reports/archive/$(date +%Y%m%d)/ 2>/dev/null
mv reports/analize.md reports/archive/$(date +%Y%m%d)/ 2>/dev/null
mv reports/limpeza-progresso.md reports/archive/$(date +%Y%m%d)/ 2>/dev/null
mv reports/plataforma_blueprint.md reports/archive/$(date +%Y%m%d)/ 2>/dev/null
mv reports/proximos-passos.md reports/archive/$(date +%Y%m%d)/ 2>/dev/null
mv reports/relatorio-correcoes-detalhado.md reports/archive/$(date +%Y%m%d)/ 2>/dev/null
mv reports/relatorio-erros-warnings.md reports/archive/$(date +%Y%m%d)/ 2>/dev/null
mv reports/revisao-estrutura-projeto.md reports/archive/$(date +%Y%m%d)/ 2>/dev/null

# Mover documentos obsoletos do docs/
mv docs/CORRECAO_DUPLICIDADE_CONFIGURACOES.md docs/archive/$(date +%Y%m%d)/ 2>/dev/null
mv docs/DASHBOARD_INTRODUCAO_IMPLEMENTACAO.md docs/archive/$(date +%Y%m%d)/ 2>/dev/null
mv docs/PLANO_ACAO_FASE1_SEGURANCA.md docs/archive/$(date +%Y%m%d)/ 2>/dev/null
mv docs/PLANO_ESTRATEGICO_MELHORIAS.md docs/archive/$(date +%Y%m%d)/ 2>/dev/null
mv docs/PLANO_ESTRATEGICO_MELHORIAS_ATUALIZADO.md docs/archive/$(date +%Y%m%d)/ 2>/dev/null

# Mover documentos principais para pasta raiz se ainda não estão lá
cp ANALISE_COMPLETA_PROJETO.md docs/ 2>/dev/null
cp PLANO_ACAO_ESTRATEGICO.md docs/ 2>/dev/null

echo "✅ Limpeza concluída!"
echo "📊 Documentos principais ativos:"
echo "   - ANALISE_COMPLETA_PROJETO.md"
echo "   - PLANO_ACAO_ESTRATEGICO.md"
echo ""
echo "📦 Documentos arquivados em:"
echo "   - docs/archive/$(date +%Y%m%d)/"
echo "   - reports/archive/$(date +%Y%m%d)/"
echo ""
echo "🚀 Pronto para iniciar Sprint 1!"