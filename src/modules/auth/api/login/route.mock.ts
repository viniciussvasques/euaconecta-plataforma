/**
 * Mock para os arquivos route.ts de API do Next.js
 * 
 * Este arquivo permite que os handlers de API sejam importados e testados
 * mesmo quando não estão em um ambiente de Next.js completo.
 */

// Exports simulados para testes
export const GET = jest.fn();
export const POST = jest.fn();
export const PUT = jest.fn();
export const DELETE = jest.fn();
export const PATCH = jest.fn();