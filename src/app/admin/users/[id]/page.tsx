import { notFound } from 'next/navigation'
import { UserProfile } from './user-profile'
import { UserService } from '@/lib/users'

interface UserProfilePageProps {
  params: Promise<{ id: string }>
}

export default async function UserProfilePage({ params }: UserProfilePageProps) {
  const { id } = await params
  
  try {
    const user = await UserService.getUserById(id)
    
    if (!user) {
      notFound()
    }

    return <UserProfile user={user} />
  } catch (error) {
    console.error('Erro ao carregar usuário:', error)
    notFound()
  }
}
