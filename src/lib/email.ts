import nodemailer from 'nodemailer'

export type MailerOptions = {
  host: string
  port: number
  secure: boolean
  user: string
  pass: string
  from: string
}

let cachedTransporter: nodemailer.Transporter | null = null

export function getTransporter(opts?: Partial<MailerOptions>) {
  if (cachedTransporter) return cachedTransporter
  const host = opts?.host || process.env.SMTP_HOST || 'smtp.zoho.com'
  const port = Number(opts?.port || process.env.SMTP_PORT || 465)
  const secure = String(opts?.secure ?? process.env.SMTP_SECURE ?? 'true') === 'true'
  const user = opts?.user || process.env.SMTP_USER || ''
  const pass = opts?.pass || process.env.SMTP_PASS || ''

  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  })
  return cachedTransporter
}

export async function sendMail(to: string, subject: string, html: string) {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@example.com'
  const transporter = getTransporter()
  await transporter.sendMail({ from, to, subject, html })
}

export interface EmailOptions {
  to: string
  subject: string
  html: string
}

export const EmailService = {
  async sendMail(options: EmailOptions) {
    const transporter = getTransporter()
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
    })
  },

  // Basic templates (can be expanded with more dynamic content)
  welcomeEmail(userName: string, userEmail: string) {
    return {
      to: userEmail,
      subject: 'Bem-vindo(a) à EuaConecta! 🚀',
      html: `
        <div style="font-family:Arial,Helvetica,sans-serif;background:#f6f8fb;padding:24px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e6e9f0;">
            <tr>
              <td style="padding:24px 24px 0 24px;">
                <h1 style="margin:0 0 8px 0;font-size:22px;color:#111827;">Olá, ${userName}! 👋</h1>
                <p style="margin:0;color:#6b7280;font-size:14px;">Seja bem-vindo(a) à plataforma EuaConecta.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 24px;color:#374151;font-size:14px;line-height:1.6;">
                <p>Agora você pode adicionar pacotes, consolidar compras e acompanhar envios.</p>
                <p>Para começar, acesse seu dashboard:</p>
                <p>
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display:inline-block;background:#1f2937;color:#ffffff;text-decoration:none;padding:10px 16px;border-radius:8px;font-weight:600;">Abrir Dashboard</a>
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 24px;color:#9ca3af;font-size:12px;border-top:1px solid #f3f4f6;">
                <p style="margin:0;">Equipe EuaConecta • <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="color:#6b7280;text-decoration:none;">${process.env.NEXT_PUBLIC_APP_URL}</a></p>
              </td>
            </tr>
          </table>
        </div>
      `,
    }
  },

  activationEmail(userName: string, userEmail: string, activationLink: string) {
    return {
      to: userEmail,
      subject: 'Ative sua conta EuaConecta ✅',
      html: `
        <div style="font-family:Arial,Helvetica,sans-serif;background:#f6f8fb;padding:24px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e6e9f0;">
            <tr>
              <td style="padding:24px 24px 0 24px;">
                <h1 style="margin:0 0 8px 0;font-size:22px;color:#111827;">Confirme sua conta, ${userName}</h1>
                <p style="margin:0;color:#6b7280;font-size:14px;">Clique no botão abaixo para ativar seu acesso.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 24px;color:#374151;font-size:14px;line-height:1.6;">
                <p>Esse link expira em 24 horas por segurança.</p>
                <p>
                  <a href="${activationLink}" style="display:inline-block;background:#10b981;color:#ffffff;text-decoration:none;padding:10px 16px;border-radius:8px;font-weight:600;">Ativar minha conta</a>
                </p>
                <p>Se você não criou uma conta, ignore este e-mail.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 24px;color:#9ca3af;font-size:12px;border-top:1px solid #f3f4f6;">
                <p style="margin:0;">Equipe EuaConecta • <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="color:#6b7280;text-decoration:none;">${process.env.NEXT_PUBLIC_APP_URL}</a></p>
              </td>
            </tr>
          </table>
        </div>
      `,
    }
  },

  packageShippedEmail(userName: string, userEmail: string, trackingCode: string, trackingLink: string) {
    return {
      to: userEmail,
      subject: 'Seu pacote foi enviado 📦',
      html: `
        <div style="font-family:Arial,Helvetica,sans-serif;background:#f6f8fb;padding:24px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e6e9f0;">
            <tr>
              <td style="padding:24px 24px 0 24px;">
                <h1 style="margin:0 0 8px 0;font-size:22px;color:#111827;">Enviamos seu pacote, ${userName}!</h1>
                <p style="margin:0;color:#6b7280;font-size:14px;">Acompanhe os detalhes abaixo.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 24px;color:#374151;font-size:14px;line-height:1.6;">
                <p><strong>Código de Rastreio:</strong> ${trackingCode}</p>
                <p>
                  <a href="${trackingLink}" style="display:inline-block;background:#3b82f6;color:#ffffff;text-decoration:none;padding:10px 16px;border-radius:8px;font-weight:600;">Rastrear pacote</a>
                </p>
                <p>Observação: pode levar até 2 dias úteis para o rastreio atualizar.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 24px;color:#9ca3af;font-size:12px;border-top:1px solid #f3f4f6;">
                <p style="margin:0;">Equipe EuaConecta • <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="color:#6b7280;text-decoration:none;">${process.env.NEXT_PUBLIC_APP_URL}</a></p>
              </td>
            </tr>
          </table>
        </div>
      `,
    }
  },

  paymentConfirmationEmail(userName: string, amount: number, paymentMethod: string, paymentId: string) {
    return `
      <div style="font-family:Arial,Helvetica,sans-serif;background:#f6f8fb;padding:24px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e6e9f0;">
          <tr>
            <td style="padding:24px 24px 0 24px;">
              <h1 style="margin:0 0 8px 0;font-size:22px;color:#111827;">✅ Pagamento Confirmado!</h1>
              <p style="margin:0;color:#6b7280;font-size:14px;">Olá ${userName}, seu pagamento foi processado com sucesso.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 24px;color:#374151;font-size:14px;line-height:1.6;">
              <div style="background:#f0f9ff;padding:16px;border-radius:8px;margin:16px 0;">
                <h3 style="margin:0 0 12px 0;color:#0369a1;">Detalhes do Pagamento</h3>
                <p style="margin:4px 0;"><strong>Valor:</strong> US$ ${amount.toFixed(2)}</p>
                <p style="margin:4px 0;"><strong>Método:</strong> ${paymentMethod}</p>
                <p style="margin:4px 0;"><strong>ID do Pagamento:</strong> ${paymentId}</p>
                <p style="margin:4px 0;"><strong>Data:</strong> ${new Date().toLocaleDateString('pt-BR')}</p>
              </div>
              <p>Seu pacote será processado e enviado em breve. Você receberá atualizações sobre o status do envio.</p>
              <p>Obrigado por escolher a Euaconecta!</p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 24px;color:#9ca3af;font-size:12px;border-top:1px solid #f3f4f6;">
              <p style="margin:0;">Este é um email automático, não responda.</p>
              <p style="margin:0;">© 2024 Euaconecta - Todos os direitos reservados</p>
            </td>
          </tr>
        </table>
      </div>
    `
  },
}


