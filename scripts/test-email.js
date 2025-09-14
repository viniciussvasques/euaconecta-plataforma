// Teste de envio de e-mail
require('dotenv').config()
const nodemailer = require('nodemailer')

const getTransporter = () => {
  console.log('Configuração SMTP:', {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE,
    user: process.env.SMTP_USER
  })
  
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

async function testEmail() {
  try {
    console.log('Enviando e-mail de teste...')
    
    const transporter = getTransporter()
    
    const email = {
      from: process.env.SMTP_FROM,
      to: 'viniciusvasqueslog@gmail.com',
      subject: 'Teste EuaConecta ✅',
      html: `
        <div style="font-family:Arial,Helvetica,sans-serif;background:#f6f8fb;padding:24px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e6e9f0;">
            <tr>
              <td style="padding:24px 24px 0 24px;">
                <h1 style="margin:0 0 8px 0;font-size:22px;color:#111827;">Teste de E-mail</h1>
                <p style="margin:0;color:#6b7280;font-size:14px;">Sistema de e-mail funcionando!</p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 24px;color:#374151;font-size:14px;line-height:1.6;">
                <p>Este é um e-mail de teste do sistema EuaConecta.</p>
                <p>Se você recebeu este e-mail, o sistema está funcionando corretamente.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 24px;color:#9ca3af;font-size:12px;border-top:1px solid #f3f4f6;">
                <p style="margin:0;">Equipe EuaConecta • ${process.env.NEXT_PUBLIC_APP_URL}</p>
              </td>
            </tr>
          </table>
        </div>
      `,
    }
    
    await transporter.sendMail(email)
    console.log('✅ E-mail enviado com sucesso!')
  } catch (error) {
    console.error('❌ Erro ao enviar e-mail:', error)
  }
}

testEmail()
