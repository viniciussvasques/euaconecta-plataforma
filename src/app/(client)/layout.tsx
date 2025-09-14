import { ClientLayout } from './client-layout'

export default function ClientAppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ClientLayout>{children}</ClientLayout>
}
