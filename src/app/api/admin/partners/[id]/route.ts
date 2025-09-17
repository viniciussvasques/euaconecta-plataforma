import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const PARTNERS_FILE = path.join(process.cwd(), 'data', 'partners.json')

interface PartnerRecord {
  id: string
  [key: string]: unknown
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json()
    const { id } = await params

    if (!fs.existsSync(PARTNERS_FILE)) {
      return NextResponse.json(
        { success: false, error: 'Arquivo de parceiros não encontrado' },
        { status: 404 }
      )
    }

    const partners: PartnerRecord[] = JSON.parse(fs.readFileSync(PARTNERS_FILE, 'utf8'))
    const partnerIndex = partners.findIndex((p: PartnerRecord) => p.id === id)

    if (partnerIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Parceiro não encontrado' },
        { status: 404 }
      )
    }

    // Atualizar parceiro
    partners[partnerIndex] = {
      ...partners[partnerIndex],
      ...body,
      id, // Manter o ID original
      updatedAt: new Date().toISOString()
    }

    // Salvar no arquivo
    fs.writeFileSync(PARTNERS_FILE, JSON.stringify(partners, null, 2))

    return NextResponse.json({
      success: true,
      data: partners[partnerIndex],
      message: 'Parceiro atualizado com sucesso'
    })
  } catch (error) {
    console.error('Erro ao atualizar parceiro:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!fs.existsSync(PARTNERS_FILE)) {
      return NextResponse.json(
        { success: false, error: 'Arquivo de parceiros não encontrado' },
        { status: 404 }
      )
    }

    const partners: PartnerRecord[] = JSON.parse(fs.readFileSync(PARTNERS_FILE, 'utf8'))
    const partnerIndex = partners.findIndex((p: PartnerRecord) => p.id === id)

    if (partnerIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Parceiro não encontrado' },
        { status: 404 }
      )
    }

    // Remover parceiro
    const deletedPartner = partners.splice(partnerIndex, 1)[0]

    // Salvar no arquivo
    fs.writeFileSync(PARTNERS_FILE, JSON.stringify(partners, null, 2))

    return NextResponse.json({
      success: true,
      data: deletedPartner,
      message: 'Parceiro excluído com sucesso'
    })
  } catch (error) {
    console.error('Erro ao excluir parceiro:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
