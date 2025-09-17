import jsPDF from 'jspdf'
import JsBarcode from 'jsbarcode'

export interface PackageLabelData {
  packageId: string
  userId: string
  userName: string
  userEmail: string
  suiteNumber: number | null
  cpf: string | null
  phone: string | null
  description: string
  weightGrams: number | null
  purchasePrice: number | null
  store: string | null
  orderNumber: string | null
  trackingIn: string | null
  carrier: string | null
  packageType: string | null
  confirmedAt: Date
  confirmedBy: string
}

export interface ConsolidationLabelData {
  consolidationId: string
  userId: string
  userName: string
  userEmail: string
  suiteNumber: number | null
  cpf: string | null
  phone: string | null
  address: {
    name: string
    line1: string
    line2?: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  packages: Array<{
    id: string
    description: string
    weightGrams: number
    purchasePrice: number
    store: string
    orderNumber: string
  }>
  totalWeight: number
  totalValue: number
  boxSize: string
  createdAt: Date
}

export class LabelGenerator {
  // Gerar etiqueta de pacote individual
  static async generatePackageLabel(data: PackageLabelData, size: '4x6' | '3x4' = '4x6'): Promise<Blob> {
    // Formatos térmicos comuns (mm): 4x6" = 100x150, 3x4" = 76x101
    const format = size === '4x6' ? [100, 150] : [76, 101]
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format })

    // Configurações de impressão térmica
    const margin = 8
    let y = margin + 2
    const line = (yPos: number) => doc.line(margin, yPos, format[0] - margin, yPos)
    const text = (t: string, fs = 9, bold = false) => {
      doc.setTextColor(0)
      doc.setFont('helvetica', bold ? 'bold' : 'normal')
      doc.setFontSize(fs)
      doc.text(t, margin, y)
      y += Math.max(4, fs / 2)
    }

    // Topo: Suite grande e ID
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(26)
    doc.text(`SUITE ${data.suiteNumber ?? 'N/A'}`, margin, y)
    y += 9
    doc.setFontSize(12)
    doc.text(`PACOTE ${data.packageId}`, margin, y)
    // Remover linha logo abaixo do cabeçalho e dar um respiro extra
    y += 10

    // De/Para simples (somente preto)
    // Título de seção sem linha
    text('PARA:', 11, true)
    text(`${data.userName}`)
    if (data.phone) text(`Tel: ${data.phone}`)
    if (data.cpf) text(`CPF: ${data.cpf}`)
    y += 1

    text('DETALHES:', 11, true)
    if (data.description) text(`${data.description}`)
    if (data.store) text(`Loja: ${data.store}`)
    if (data.orderNumber) text(`Pedido: ${data.orderNumber}`)
    if (data.trackingIn) text(`Tracking In: ${data.trackingIn}`)
    if (data.carrier) text(`Carrier: ${data.carrier}`)
    if (data.packageType) text(`Tipo: ${data.packageType}`)

    const weightStr = data.weightGrams ? `${data.weightGrams} g` : 'N/A'
    const valueStr = data.purchasePrice ? `$${Number(data.purchasePrice).toFixed(2)}` : 'N/A'
    text(`Peso: ${weightStr}    Valor: ${valueStr}`, 11, true)
    y += 1
    text(`Confirmado: ${data.confirmedAt.toLocaleDateString('pt-BR')} • ${data.confirmedBy}`, 8)
    y += 1
    line(y)
    y += 2

    // Código de barras grande e legível
    const barcodeData = `${data.packageId}`
    const canvas = document.createElement('canvas')
    JsBarcode(canvas, barcodeData, { format: 'CODE128', width: 2.0, height: 48, displayValue: false, margin: 0 })
    const barcodeImage = canvas.toDataURL('image/png')
    const barcodeWidth = format[0] - margin * 2
    doc.addImage(barcodeImage, 'PNG', margin, y, barcodeWidth, 28)
    y += 32

    // Rodapé
    text(`ID: ${data.packageId}`, 10)
    return doc.output('blob')
  }

  // Gerar etiqueta de consolidação
  static async generateConsolidationLabel(data: ConsolidationLabelData, size: '4x6' | '3x4' = '4x6'): Promise<Blob> {
    const format = size === '4x6' ? [100, 150] : [76, 101]
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format })

    const margin = 8
    let y = margin + 2
    const line = (yPos: number) => doc.line(margin, yPos, format[0] - margin, yPos)
    const text = (t: string, fs = 9, bold = false) => {
      doc.setTextColor(0)
      doc.setFont('helvetica', bold ? 'bold' : 'normal')
      doc.setFontSize(fs)
      doc.text(t, margin, y)
      y += Math.max(4, fs / 2)
    }

    // Topo: Consolidação + Suite
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(18)
    doc.text(`CONSOLIDAÇÃO ${data.consolidationId}`, margin, y)
    y += 7
    doc.setFontSize(12)
    doc.text(`SUITE ${data.suiteNumber ?? 'N/A'}  •  ITENS ${data.packages.length}`, margin, y)
    y += 6
    line(y)
    y += 2

    // Cliente e entrega
    text('CLIENTE:', 10, true)
    text(`${data.userName}`)
    if (data.phone) text(`Tel: ${data.phone}`)
    y += 1
    text('ENTREGA:', 10, true)
    text(`${data.address.name}`)
    text(`${data.address.line1}`)
    if (data.address.line2) text(`${data.address.line2}`)
    text(`${data.address.city} - ${data.address.state}  CEP: ${data.address.postalCode}`)
    y += 1

    // Resumo
    const peso = `${data.totalWeight} g`
    const valor = `$${data.totalValue.toFixed(2)}`
    text(`Caixa: ${data.boxSize}    Peso: ${peso}    Valor: ${valor}`, 10, true)
    y += 1
    line(y)
    y += 2

    // Código de barras grande
    const canvas = document.createElement('canvas')
    JsBarcode(canvas, `CONS-${data.consolidationId}`, { format: 'CODE128', width: 2.2, height: 42, displayValue: true, fontSize: 10, margin: 0 })
    const barcodeImg = canvas.toDataURL('image/png')
    const barcodeWidth = format[0] - margin * 2
    doc.addImage(barcodeImg, 'PNG', margin, y, barcodeWidth, 24)
    y += 28

    // Rodapé
    text(`Criado: ${data.createdAt.toLocaleDateString('pt-BR')}`, 9)
    return doc.output('blob')
  }

  // Gerar relatório de consolidação
  static async generateConsolidationReport(data: ConsolidationLabelData): Promise<Blob> {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    const margin = 20
    const lineHeight = 6
    let yPosition = margin

    const addText = (text: string, fontSize: number = 12, isBold: boolean = false) => {
      doc.setFontSize(fontSize)
      if (isBold) {
        doc.setFont('helvetica', 'bold')
      } else {
        doc.setFont('helvetica', 'normal')
      }
      doc.text(text, margin, yPosition)
      yPosition += lineHeight
    }

    // Cabeçalho do relatório
    addText('RELATÓRIO DE CONSOLIDAÇÃO', 18, true)
    addText('─'.repeat(40), 12)
    yPosition += 5

    // Dados do cliente
    addText('DADOS DO CLIENTE:', 14, true)
    addText(`Nome: ${data.userName}`, 12)
    addText(`Email: ${data.userEmail}`, 12)
    addText(`Suite: ${data.suiteNumber || 'N/A'}`, 12)
    if (data.cpf) addText(`CPF: ${data.cpf}`, 12)
    if (data.phone) addText(`Telefone: ${data.phone}`, 12)
    yPosition += 5

    // Endereço de entrega
    addText('ENDEREÇO DE ENTREGA:', 14, true)
    addText(data.address.name, 12)
    addText(data.address.line1, 12)
    if (data.address.line2) addText(data.address.line2, 12)
    addText(`${data.address.city} - ${data.address.state}`, 12)
    addText(`CEP: ${data.address.postalCode}`, 12)
    addText(`País: ${data.address.country}`, 12)
    yPosition += 5

    // Resumo da consolidação
    addText('RESUMO DA CONSOLIDAÇÃO:', 14, true)
    addText(`ID da Consolidação: ${data.consolidationId}`, 12)
    addText(`Tamanho da Caixa: ${data.boxSize}`, 12)
    addText(`Total de Itens: ${data.packages.length}`, 12)
    addText(`Peso Total: ${data.totalWeight}g`, 12)
    addText(`Valor Total: $${data.totalValue.toFixed(2)}`, 12, true)
    addText(`Data de Criação: ${data.createdAt.toLocaleDateString('pt-BR')}`, 12)
    yPosition += 5

    // Lista de itens
    addText('ITENS INCLUÍDOS:', 14, true)
    yPosition += 2

    // Cabeçalho da tabela
    // Linha inicial da tabela (mantida como referência em versões anteriores)
    // Removida para evitar warning de variável não utilizada.
    addText('Item', 10, true)
    doc.text('Descrição', margin + 20, yPosition - lineHeight)
    doc.text('Loja', margin + 80, yPosition - lineHeight)
    doc.text('Peso', margin + 110, yPosition - lineHeight)
    doc.text('Valor', margin + 130, yPosition - lineHeight)
    doc.text('Pedido', margin + 160, yPosition - lineHeight)
    yPosition += 2

    // Linha separadora
    doc.line(margin, yPosition, margin + 180, yPosition)
    yPosition += 2

    // Itens da tabela
    data.packages.forEach((pkg, index) => {
      if (yPosition > 250) { // Nova página se necessário
        doc.addPage()
        yPosition = margin
      }

      addText(`${index + 1}`, 9)
      doc.text(pkg.description.substring(0, 30), margin + 20, yPosition - lineHeight)
      doc.text(pkg.store || 'N/A', margin + 80, yPosition - lineHeight)
      doc.text(`${pkg.weightGrams}g`, margin + 110, yPosition - lineHeight)
      doc.text(`$${Number(pkg.purchasePrice).toFixed(2)}`, margin + 130, yPosition - lineHeight)
      doc.text(pkg.orderNumber || 'N/A', margin + 160, yPosition - lineHeight)
    })

    yPosition += 10

    // Rodapé
    addText('─'.repeat(40), 12)
    addText('Este relatório contém todos os itens consolidados para envio.', 10)
    addText('Gerado automaticamente pelo sistema Euaconecta.', 10)

    return doc.output('blob')
  }

  // Função para baixar arquivo
  static downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}
