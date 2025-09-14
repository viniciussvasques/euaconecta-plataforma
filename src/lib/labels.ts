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
  static async generatePackageLabel(data: PackageLabelData): Promise<Blob> {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [100, 150] // Tamanho padrão de etiqueta
    })

    // Configurações
    const margin = 5
    const lineHeight = 4
    let yPosition = margin

    // Função para adicionar texto
    const addText = (text: string, fontSize: number = 10, isBold: boolean = false) => {
      doc.setFontSize(fontSize)
      if (isBold) {
        doc.setFont('helvetica', 'bold')
      } else {
        doc.setFont('helvetica', 'normal')
      }
      doc.text(text, margin, yPosition)
      yPosition += lineHeight
    }

    // Cabeçalho
    addText('ETIQUETA DE PACOTE', 14, true)
    addText('─'.repeat(20), 10)
    yPosition += 2

    // Dados do usuário
    addText('CLIENTE:', 10, true)
    addText(data.userName, 10)
    addText(`Suite: ${data.suiteNumber || 'N/A'}`, 9)
    if (data.cpf) addText(`CPF: ${data.cpf}`, 9)
    if (data.phone) addText(`Tel: ${data.phone}`, 9)
    yPosition += 2

    // Dados do pacote
    addText('PACOTE:', 10, true)
    addText(data.description, 9)
    if (data.store) addText(`Loja: ${data.store}`, 8)
    if (data.orderNumber) addText(`Pedido: ${data.orderNumber}`, 8)
    if (data.trackingIn) addText(`Tracking: ${data.trackingIn}`, 8)
    if (data.carrier) addText(`Transportadora: ${data.carrier}`, 8)
    if (data.packageType) addText(`Tipo: ${data.packageType}`, 8)
    yPosition += 2

    // Peso e valor
    if (data.weightGrams) addText(`Peso: ${data.weightGrams}g`, 9, true)
    if (data.purchasePrice) addText(`Valor: $${Number(data.purchasePrice).toFixed(2)}`, 9, true)
    yPosition += 2

    // Data de confirmação
    addText(`Confirmado em: ${data.confirmedAt.toLocaleDateString('pt-BR')}`, 8)
    addText(`Por: ${data.confirmedBy}`, 8)
    yPosition += 3

    // Código de barras
    const barcodeData = `PKG-${data.packageId}`
    const canvas = document.createElement('canvas')
    JsBarcode(canvas, barcodeData, {
      format: 'CODE128',
      width: 2,
      height: 30,
      displayValue: true,
      fontSize: 8
    })

    // Adicionar código de barras ao PDF
    const barcodeImage = canvas.toDataURL('image/png')
    doc.addImage(barcodeImage, 'PNG', margin, yPosition, 80, 20)
    yPosition += 25

    // ID do pacote
    addText(`ID: ${data.packageId}`, 8)

    return doc.output('blob')
  }

  // Gerar etiqueta de consolidação
  static async generateConsolidationLabel(data: ConsolidationLabelData): Promise<Blob> {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [100, 150]
    })

    const margin = 5
    const lineHeight = 4
    let yPosition = margin

    const addText = (text: string, fontSize: number = 10, isBold: boolean = false) => {
      doc.setFontSize(fontSize)
      if (isBold) {
        doc.setFont('helvetica', 'bold')
      } else {
        doc.setFont('helvetica', 'normal')
      }
      doc.text(text, margin, yPosition)
      yPosition += lineHeight
    }

    // Cabeçalho
    addText('ETIQUETA DE CONSOLIDAÇÃO', 14, true)
    addText('─'.repeat(25), 10)
    yPosition += 2

    // Dados do cliente
    addText('CLIENTE:', 10, true)
    addText(data.userName, 10)
    addText(`Suite: ${data.suiteNumber || 'N/A'}`, 9)
    if (data.cpf) addText(`CPF: ${data.cpf}`, 9)
    if (data.phone) addText(`Tel: ${data.phone}`, 9)
    yPosition += 2

    // Endereço de entrega
    addText('ENTREGA:', 10, true)
    addText(data.address.name, 9)
    addText(data.address.line1, 9)
    if (data.address.line2) addText(data.address.line2, 9)
    addText(`${data.address.city} - ${data.address.state}`, 9)
    addText(`CEP: ${data.address.postalCode}`, 9)
    yPosition += 2

    // Resumo da caixa
    addText('CAIXA:', 10, true)
    addText(`Tamanho: ${data.boxSize}`, 9)
    addText(`Itens: ${data.packages.length}`, 9)
    addText(`Peso Total: ${data.totalWeight}g`, 9, true)
    addText(`Valor Total: $${data.totalValue.toFixed(2)}`, 9, true)
    yPosition += 2

    // Código de barras da consolidação
    const barcodeData = `CONS-${data.consolidationId}`
    const canvas = document.createElement('canvas')
    JsBarcode(canvas, barcodeData, {
      format: 'CODE128',
      width: 2,
      height: 30,
      displayValue: true,
      fontSize: 8
    })

    const barcodeImage = canvas.toDataURL('image/png')
    doc.addImage(barcodeImage, 'PNG', margin, yPosition, 80, 20)
    yPosition += 25

    // ID da consolidação
    addText(`ID: ${data.consolidationId}`, 8)
    addText(`Criado em: ${data.createdAt.toLocaleDateString('pt-BR')}`, 8)

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
    const tableStartY = yPosition
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
