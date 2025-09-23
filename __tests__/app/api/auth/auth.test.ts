import { describe, expect, it, beforeAll, afterAll, beforeEach, jest } from '@jest/globals'
// Importações dos mocks para os routes
import { POST as loginHandler } from '../../../../src/app/api/auth/login/route.mock'
import { POST as logoutHandler } from '../../../../src/app/api/auth/logout/route.mock'
import { createTestRequestResponse, setupTestEnvironment, cleanTestDatabase, createTestUser } from '../../../../src/lib/testing/api-test-utils'
import { cookies } from 'next/headers'

// Mock do módulo next/headers
jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn()
  }))
}))

describe('API de Autenticação', () => {
  beforeAll(async () => {
    // Configurar ambiente de teste
    setupTestEnvironment()
  })

  beforeEach(async () => {
    // Limpar banco de dados antes de cada teste
    await cleanTestDatabase()
    
    // Resetar mocks
    jest.clearAllMocks()
  })

  afterAll(async () => {
    // Limpeza final
    await cleanTestDatabase()
  })

  describe('POST /api/auth/login', () => {
    it('deve retornar erro para credenciais inválidas', async () => {
      // Arrange
      const { req } = createTestRequestResponse({
        method: 'POST',
        body: {
          email: 'usuario@exemplo.com',
          password: 'senha_errada'
        } as Record<string, any>
      })

      // Act
      const response = await loginHandler(req)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(401)
      expect(data).toHaveProperty('success', false)
      expect(data).toHaveProperty('error')
    })

    it('deve autenticar usuário com credenciais corretas', async () => {
      // Arrange
      const testUser = await createTestUser({
        email: 'usuario_teste@exemplo.com',
        password: '$2b$10$dka7KgAQpDTa8SvF9fWHHOWS9fIQiGW7Z5E.4DP.WDvJqM1lXwKvS' // password123
      })

      const { req } = createTestRequestResponse({
        method: 'POST',
        body: {
          email: 'usuario_teste@exemplo.com',
          password: 'password123'
        } as Record<string, any>
      })

      // Mock cookies
      const setCookieMock = jest.fn();
      const cookiesMock = {
        get: jest.fn(),
        set: setCookieMock,
        delete: jest.fn()
      };
      (cookies as jest.Mock).mockReturnValue(cookiesMock);

      // Act
      const response = await loginHandler(req)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data).toHaveProperty('success', true)
      expect(data).toHaveProperty('user')
      expect(data.user).toHaveProperty('id', testUser.id)
      expect(setCookieMock).toHaveBeenCalledTimes(2) // session e refreshToken
    })
  })

  describe('POST /api/auth/logout', () => {
    it('deve retornar erro quando não há sessão', async () => {
      // Arrange
      const { req } = createTestRequestResponse({
        method: 'POST'
      })
      
      // Mock cookies para simular que não há sessão
      const cookiesMock = {
        get: jest.fn().mockReturnValue(null),
        set: jest.fn(),
        delete: jest.fn()
      };
      (cookies as jest.Mock).mockReturnValue(cookiesMock);

      // Act
      const response = await logoutHandler(req)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(401)
      expect(data).toHaveProperty('success', false)
    })

    it('deve fazer logout com sucesso quando há sessão válida', async () => {
      // Arrange
      const testUser = await createTestUser()
      
      const { req } = createTestRequestResponse({
        method: 'POST'
      })
      
      // Mock cookies para simular sessão válida
      const cookiesMock = {
        get: jest.fn().mockReturnValue({
          name: 'session',
          value: JSON.stringify({ userId: testUser.id, role: 'CLIENT' })
        }),
        set: jest.fn(),
        delete: jest.fn()
      };
      (cookies as jest.Mock).mockReturnValue(cookiesMock);

      // Act
      const response = await logoutHandler(req)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data).toHaveProperty('success', true)
      expect(cookiesMock.delete).toHaveBeenCalledTimes(2) // session e refreshToken
    })
  })
})