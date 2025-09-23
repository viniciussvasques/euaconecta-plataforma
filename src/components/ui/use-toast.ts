interface ToastOptions {
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
}

export const toast = ({ title, description, variant = 'default' }: ToastOptions) => {
  const message = `${title}${description ? `: ${description}` : ''}`
  console.log(`[Toast - ${variant}]:`, message)
  // Aqui podemos adicionar uma notificação visual mais tarde
  alert(message)
}