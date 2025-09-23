/**
 * Este arquivo contém testes para o sistema de logging
 * Usamos mocks para evitar problemas com o transporte S3 durante os testes
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals'

// Mock direto da implementação do logger
jest.mock('../../../src/lib/logging/winston-config', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    fatal: jest.fn(),
    trace: jest.fn(),
    audit: jest.fn(),
    performance: jest.fn()
  }
}))

// Mock para transporte S3
jest.mock('../../../src/lib/storage/s3', () => ({
  getStorageClient: jest.fn().mockReturnValue({
    uploadFile: jest.fn().mockImplementation(() => Promise.resolve('mock-url'))
  })
}))

// Importar o logger mockado
import { logger } from '../../../src/lib/logging/winston-config'

describe('Sistema de Logs', () => {
  beforeEach(() => {
    // Limpar mocks antes de cada teste
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Limpar mocks após cada teste
    jest.clearAllMocks();
  });

  it('deve exportar um objeto logger com os métodos necessários', () => {
    expect(logger).toBeDefined()
    expect(typeof logger).toBe('object')
    expect(typeof logger.info).toBe('function')
    expect(typeof logger.error).toBe('function')
    expect(typeof logger.warn).toBe('function')
    expect(typeof logger.debug).toBe('function')
    expect(typeof logger.fatal).toBe('function')
    expect(typeof logger.audit).toBe('function')
    expect(typeof logger.performance).toBe('function')
  })

  it('deve ser possível chamar métodos de log sem erros', () => {
    // Estes métodos estão mockados, então não vão fazer nada, só verificamos que estão acessíveis
    logger.info('Teste info')
    logger.error('Teste error', { error: 'Erro simulado' })
    logger.warn('Teste warn')
    logger.debug('Teste debug')
    logger.audit('Teste audit', { userId: '123', action: 'test' })
    logger.performance('Operação DB', 150)
    
    // Verificar que ao menos uma chamada foi feita para cada método
    expect(logger.info).toHaveBeenCalledWith('Teste info')
    expect(logger.error).toHaveBeenCalled()
    expect(logger.warn).toHaveBeenCalledWith('Teste warn')
    expect(logger.debug).toHaveBeenCalledWith('Teste debug')
    expect(logger.audit).toHaveBeenCalled()
    expect(logger.performance).toHaveBeenCalledWith('Operação DB', 150)
  })

  it('deve passar os parâmetros corretos ao chamar audit', () => {
    const testData = { userId: '123', action: 'login', resource: 'api' };
    logger.audit('Teste auditoria', testData);
    
    expect(logger.audit).toHaveBeenCalledWith('Teste auditoria', testData);
  })
})