// Tabelas oficiais ABC Packet (Packet Standard e Express)
// Valores em dólares (USD). Vamos converter para cents na API.

export type AbcPacketService = 'STANDARD' | 'EXPRESS'

type Rates = { [grams: number]: number }

// Pesos em gramas → preço em USD conforme imagem enviada
export const ABC_PACKET_STANDARD: Rates = {
  500: 12.78, 1000: 18.15, 1500: 23.35, 2000: 28.56, 2500: 33.76, 3000: 38.97,
  4000: 45.25, 5000: 53.02, 6000: 62.13, 7000: 71.30, 8000: 80.36, 9000: 88.83,
  10000: 95.92, 11000: 104.11, 12000: 112.50, 13000: 120.89, 14000: 129.26,
  15000: 137.65, 16000: 150.22, 17000: 158.60, 18000: 166.99, 19000: 175.38,
  20000: 183.75, 21000: 196.73, 22000: 204.71, 23000: 213.09, 24000: 221.47,
  25000: 229.85, 26000: 242.43, 27000: 250.81, 28000: 259.18, 29000: 267.58,
  30000: 280.15,
}

export const ABC_PACKET_EXPRESS: Rates = {
  500: 14.05, 1000: 19.29, 1500: 23.95, 2000: 28.70, 2500: 34.00, 3000: 40.00,
  4000: 47.40, 5000: 56.80, 6000: 63.70, 7000: 75.30, 8000: 84.70, 9000: 94.20,
  10000: 103.30, 11000: 107.20, 12000: 122.20, 13000: 131.70, 14000: 140.20,
  15000: 150.30, 16000: 159.30, 17000: 169.20, 18000: 178.20, 19000: 188.20,
  20000: 196.70, 21000: 206.50, 22000: 215.20, 23000: 225.20, 24000: 233.00,
  25000: 244.30, 26000: 253.00, 27000: 263.10, 28000: 271.70, 29000: 280.80,
  30000: 290.10,
}

export function getAbcPacketRateUSD(service: AbcPacketService, weightGrams: number): number | null {
  // Validar faixa de peso
  if (weightGrams < 500 || weightGrams > 30000) return null
  
  const table = service === 'STANDARD' ? ABC_PACKET_STANDARD : ABC_PACKET_EXPRESS
  
  // Se o peso é exato na tabela, retornar diretamente
  if (table[weightGrams as keyof typeof table]) {
    return table[weightGrams as keyof typeof table]
  }
  
  // Encontrar os dois pontos mais próximos para interpolação
  const weights = Object.keys(table).map(Number).sort((a, b) => a - b)
  
  // Se o peso é menor que o mínimo, usar o mínimo
  if (weightGrams < weights[0]) {
    return table[weights[0] as keyof typeof table]
  }
  
  // Se o peso é maior que o máximo, usar o máximo
  if (weightGrams > weights[weights.length - 1]) {
    return table[weights[weights.length - 1] as keyof typeof table]
  }
  
  // Encontrar os pontos para interpolação
  let lowerWeight = weights[0]
  let upperWeight = weights[weights.length - 1]
  
  for (let i = 0; i < weights.length - 1; i++) {
    if (weightGrams >= weights[i] && weightGrams <= weights[i + 1]) {
      lowerWeight = weights[i]
      upperWeight = weights[i + 1]
      break
    }
  }
  
  // Interpolação linear
  const lowerPrice = table[lowerWeight as keyof typeof table]
  const upperPrice = table[upperWeight as keyof typeof table]
  
  if (lowerWeight === upperWeight) {
    return lowerPrice
  }
  
  const ratio = (weightGrams - lowerWeight) / (upperWeight - lowerWeight)
  return lowerPrice + (upperPrice - lowerPrice) * ratio
}


