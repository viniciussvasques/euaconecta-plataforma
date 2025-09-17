import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const TUTORIALS_FILE = path.join(process.cwd(), 'data', 'tutorials.json')

interface TutorialRecord {
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

    if (!fs.existsSync(TUTORIALS_FILE)) {
      return NextResponse.json(
        { success: false, error: 'Arquivo de tutoriais não encontrado' },
        { status: 404 }
      )
    }

    const tutorials: TutorialRecord[] = JSON.parse(fs.readFileSync(TUTORIALS_FILE, 'utf8'))
    const tutorialIndex = tutorials.findIndex((t: TutorialRecord) => t.id === id)

    if (tutorialIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Tutorial não encontrado' },
        { status: 404 }
      )
    }

    // Atualizar tutorial
    tutorials[tutorialIndex] = {
      ...tutorials[tutorialIndex],
      ...body,
      id, // Manter o ID original
      updatedAt: new Date().toISOString()
    }

    // Salvar no arquivo
    fs.writeFileSync(TUTORIALS_FILE, JSON.stringify(tutorials, null, 2))

    return NextResponse.json({
      success: true,
      data: tutorials[tutorialIndex],
      message: 'Tutorial atualizado com sucesso'
    })
  } catch (error) {
    console.error('Erro ao atualizar tutorial:', error)
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

    if (!fs.existsSync(TUTORIALS_FILE)) {
      return NextResponse.json(
        { success: false, error: 'Arquivo de tutoriais não encontrado' },
        { status: 404 }
      )
    }

    const tutorials: TutorialRecord[] = JSON.parse(fs.readFileSync(TUTORIALS_FILE, 'utf8'))
    const tutorialIndex = tutorials.findIndex((t: TutorialRecord) => t.id === id)

    if (tutorialIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Tutorial não encontrado' },
        { status: 404 }
      )
    }

    // Remover tutorial
    const deletedTutorial = tutorials.splice(tutorialIndex, 1)[0]

    // Salvar no arquivo
    fs.writeFileSync(TUTORIALS_FILE, JSON.stringify(tutorials, null, 2))

    return NextResponse.json({
      success: true,
      data: deletedTutorial,
      message: 'Tutorial excluído com sucesso'
    })
  } catch (error) {
    console.error('Erro ao excluir tutorial:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
