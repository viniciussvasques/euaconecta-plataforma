// Utilitário para compressão e conversão de imagens
export class ImageUtils {
  // Comprimir imagem para economizar espaço
  static async compressImage(file: File, maxWidth: number = 800, quality: number = 0.7): Promise<string> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        // Calcular novas dimensões mantendo proporção
        let { width, height } = img
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }

        canvas.width = width
        canvas.height = height

        // Desenhar imagem redimensionada
        ctx?.drawImage(img, 0, 0, width, height)

        // Converter para base64 com qualidade reduzida
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality)
        resolve(compressedDataUrl)
      }

      img.onerror = () => reject(new Error('Erro ao carregar imagem'))
      img.src = URL.createObjectURL(file)
    })
  }

  // Converter base64 para blob
  static dataURLToBlob(dataURL: string): Blob {
    const arr = dataURL.split(',')
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg'
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    
    return new Blob([u8arr], { type: mime })
  }

  // Calcular tamanho do arquivo em KB
  static getFileSizeKB(dataURL: string): number {
    const base64Length = dataURL.split(',')[1].length
    return Math.round((base64Length * 0.75) / 1024) // Aproximação do tamanho em KB
  }

  // Validar se é uma imagem válida
  static isValidImage(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    const maxSize = 5 * 1024 * 1024 // 5MB
    
    return validTypes.includes(file.type) && file.size <= maxSize
  }
}
