import TutorialViewer from './tutorial-viewer'

interface TutorialPageProps {
  params: Promise<{ id: string }>
}

export default async function TutorialPage({ params }: TutorialPageProps) {
  const { id } = await params

  return <TutorialViewer tutorialId={id} />
}
