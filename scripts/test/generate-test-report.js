/**
 * Script para gerar relatório de testes
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Obter dados do último teste
function getTestResults() {
  try {
    // Se estiver usando Jest com relatório JSON
    const jestOutput = execSync('npx jest --json', { 
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore']
    });
    
    const results = JSON.parse(jestOutput);
    
    return {
      success: results.success,
      numPassedTests: results.numPassedTests,
      numFailedTests: results.numFailedTests,
      numTotalTests: results.numTotalTests,
      numPassedTestSuites: results.numPassedTestSuites,
      numFailedTestSuites: results.numFailedTestSuites,
      numTotalTestSuites: results.numTotalTestSuites,
      startTime: results.startTime,
      testResults: results.testResults
    };
  } catch (error) {
    console.error('Erro ao obter resultados dos testes:', error);
    return {
      success: false,
      numPassedTests: 0,
      numFailedTests: 0,
      numTotalTests: 0,
      numPassedTestSuites: 0,
      numFailedTestSuites: 0,
      numTotalTestSuites: 0,
      startTime: Date.now(),
      testResults: []
    };
  }
}

// Gerar relatório em formato Markdown
function generateMarkdownReport(results) {
  const date = new Date().toISOString().split('T')[0];
  const successRate = (results.numPassedTests / results.numTotalTests * 100).toFixed(2);
  
  let markdown = `# Relatório de Testes de API (${date})

## Estatísticas Gerais
- Total de testes: ${results.numTotalTests}
- Aprovados: ${results.numPassedTests}
- Falharam: ${results.numFailedTests}
- Taxa de sucesso: ${successRate}%
- Total de suites: ${results.numTotalTestSuites} (${results.numPassedTestSuites} aprovadas, ${results.numFailedTestSuites} falharam)

## Detalhes dos Testes

`;

  // Adicionar resultados por suite
  results.testResults.forEach(suite => {
    const suitePath = suite.name.replace(process.cwd(), '');
    markdown += `### Suite: ${suitePath}\n`;
    markdown += `- Status: ${suite.status}\n`;
    markdown += `- Duração: ${suite.endTime - suite.startTime}ms\n\n`;
    
    // Adicionar resultados de cada teste
    suite.assertionResults.forEach(test => {
      const status = test.status === 'passed' ? '✅' : '❌';
      markdown += `${status} ${test.title}\n`;
      
      // Se falhou, adicionar detalhes
      if (test.status !== 'passed' && test.failureMessages && test.failureMessages.length > 0) {
        markdown += '```\n';
        markdown += test.failureMessages.join('\n');
        markdown += '\n```\n';
      }
      
      markdown += '\n';
    });
    
    markdown += '\n';
  });
  
  return markdown;
}

// Função principal
function main() {
  console.log('Gerando relatório de testes...');
  
  const results = getTestResults();
  const markdownReport = generateMarkdownReport(results);
  
  // Salvar relatório
  const reportPath = path.join(process.cwd(), 'api-test-report.md');
  fs.writeFileSync(reportPath, markdownReport);
  
  console.log(`Relatório salvo em ${reportPath}`);
}

main();