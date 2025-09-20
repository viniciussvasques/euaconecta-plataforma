import { SystemCustomization, defaultCustomization } from './system-customization'

export async function getCustomization(): Promise<SystemCustomization> {
  try {
    // Em produção, você pode buscar do banco de dados
    // Por enquanto, retornamos os dados padrão
    return defaultCustomization
  } catch (error) {
    console.error('Erro ao buscar customização:', error)
    return defaultCustomization
  }
}
