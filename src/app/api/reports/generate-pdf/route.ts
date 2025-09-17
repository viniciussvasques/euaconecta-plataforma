import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { jsPDF } from 'jspdf'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    if (!startDate || !endDate) {
      return NextResponse.json(
        { success: false, error: 'Data inicial e final são obrigatórias' },
        { status: 400 }
      )
    }

    const start = new Date(startDate)
    const end = new Date(endDate)
    end.setHours(23, 59, 59, 999)

    // Fetch data for PDF
    const totalUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: start,
          lte: end
        }
      }
    })

    const totalPackages = await prisma.package.count({
      where: {
        createdAt: {
          gte: start,
          lte: end
        }
      }
    })

    const totalConsolidations = await prisma.consolidationGroup.count({
      where: {
        createdAt: {
          gte: start,
          lte: end
        }
      }
    })

    const totalRevenue = await prisma.payment.aggregate({
      where: {
        status: 'succeeded',
        createdAt: {
          gte: start,
          lte: end
        }
      },
      _sum: {
        amountCents: true
      }
    })

    const consolidations = await prisma.consolidationGroup.findMany({
      where: {
        createdAt: {
          gte: start,
          lte: end
        }
      },
      include: {
        user: true,
        packages: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Generate PDF
    const doc = new jsPDF()

    // Header
    doc.setFontSize(20)
    doc.text('Relatório de Consolidações', 20, 30)

    doc.setFontSize(12)
    doc.text(`Período: ${startDate} a ${endDate}`, 20, 45)
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 20, 55)

    // Summary
    doc.setFontSize(16)
    doc.text('Resumo Geral', 20, 75)

    doc.setFontSize(12)
    doc.text(`Total de Usuários: ${totalUsers}`, 20, 90)
    doc.text(`Total de Pacotes: ${totalPackages}`, 20, 100)
    doc.text(`Total de Consolidações: ${totalConsolidations}`, 20, 110)
    doc.text(`Receita Total: $${((totalRevenue._sum.amountCents || 0) / 100).toFixed(2)}`, 20, 120)

    // Consolidations table
    let yPosition = 140
    doc.setFontSize(16)
    doc.text('Consolidações Detalhadas', 20, yPosition)
    yPosition += 15

    doc.setFontSize(10)
    doc.text('ID', 20, yPosition)
    doc.text('Cliente', 40, yPosition)
    doc.text('Status', 80, yPosition)
    doc.text('Pacotes', 110, yPosition)
    doc.text('Valor', 130, yPosition)
    doc.text('Data', 160, yPosition)
    yPosition += 10

    consolidations.forEach((consolidation) => {
      if (yPosition > 280) {
        doc.addPage()
        yPosition = 20
        doc.setFontSize(10)
        doc.text('ID', 20, yPosition)
        doc.text('Cliente', 40, yPosition)
        doc.text('Status', 80, yPosition)
        doc.text('Pacotes', 110, yPosition)
        doc.text('Valor', 130, yPosition)
        doc.text('Data', 160, yPosition)
        yPosition += 10
      }

      const totalValue = Number(consolidation.consolidationFee) + Number(consolidation.storageFee)

      doc.text(consolidation.id.substring(0, 8), 20, yPosition)
      doc.text(consolidation.user.name || 'Sem nome', 40, yPosition)
      doc.text(consolidation.status, 80, yPosition)
      doc.text(consolidation.packages.length.toString(), 110, yPosition)
      doc.text(`$${totalValue.toFixed(2)}`, 130, yPosition)
      doc.text(consolidation.createdAt.toLocaleDateString('pt-BR'), 160, yPosition)
      yPosition += 8
    })

    // Footer
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.text(`Página ${i} de ${pageCount}`, 20, 290)
    }

    const pdfBuffer = doc.output('arraybuffer')

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="relatorio-${startDate}-${endDate}.pdf"`
      }
    })

  } catch (error) {
    console.error('Erro ao gerar PDF:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
