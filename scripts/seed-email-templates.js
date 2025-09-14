const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const defaultTemplates = [
  {
    id: 'welcome_template',
    name: 'Email de Boas-vindas',
    subject: 'Bem-vindo à Euaconecta! 🎉',
    type: 'welcome',
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin: 0;">Bem-vindo à Euaconecta!</h1>
        </div>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #1e293b; margin-top: 0;">Olá {userName}!</h2>
          <p style="color: #475569; line-height: 1.6;">
            Seja bem-vindo à Euaconecta! Estamos muito felizes em tê-lo conosco.
          </p>
          <p style="color: #475569; line-height: 1.6;">
            Sua conta foi criada com sucesso e você já pode começar a usar nossos serviços de consolidação de pacotes.
          </p>
        </div>
        
        <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #1e40af; margin-top: 0;">Próximos passos:</h3>
          <ul style="color: #1e40af; margin: 0; padding-left: 20px;">
            <li>Complete seu perfil com suas informações</li>
            <li>Adicione seu endereço de entrega</li>
            <li>Comece a enviar pacotes para nosso endereço nos EUA</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="{dashboardUrl}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Acessar Dashboard
          </a>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #64748b; font-size: 14px;">
          <p>Se você tiver alguma dúvida, não hesite em nos contatar.</p>
          <p>Equipe Euaconecta</p>
        </div>
      </div>
    `
  },
  {
    id: 'payment_confirmation_template',
    name: 'Confirmação de Pagamento',
    subject: '✅ Pagamento Confirmado - Euaconecta',
    type: 'payment_confirmation',
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #059669; margin: 0;">✅ Pagamento Confirmado!</h1>
        </div>
        
        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #14532d; margin-top: 0;">Olá {userName}!</h2>
          <p style="color: #166534; line-height: 1.6;">
            Seu pagamento foi processado com sucesso!
          </p>
        </div>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #1e293b; margin-top: 0;">Detalhes do Pagamento</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #475569;"><strong>Valor:</strong></td>
              <td style="padding: 8px 0; color: #1e293b;">{amount}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #475569;"><strong>Método:</strong></td>
              <td style="padding: 8px 0; color: #1e293b;">{paymentMethod}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #475569;"><strong>ID do Pagamento:</strong></td>
              <td style="padding: 8px 0; color: #1e293b;">{paymentId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #475569;"><strong>Data:</strong></td>
              <td style="padding: 8px 0; color: #1e293b;">{date}</td>
            </tr>
          </table>
        </div>
        
        <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <p style="color: #1e40af; margin: 0; line-height: 1.6;">
            <strong>Próximo passo:</strong> Sua consolidação será processada e você receberá atualizações sobre o status do envio.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #64748b; font-size: 14px;">
          <p>Obrigado por escolher a Euaconecta!</p>
          <p>Equipe Euaconecta</p>
        </div>
      </div>
    `
  },
  {
    id: 'package_received_template',
    name: 'Pacote Recebido',
    subject: '📦 Pacote Recebido - Euaconecta',
    type: 'package_received',
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin: 0;">📦 Pacote Recebido!</h1>
        </div>
        
        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #1e40af; margin-top: 0;">Olá {userName}!</h2>
          <p style="color: #1e40af; line-height: 1.6;">
            Recebemos seu pacote com sucesso!
          </p>
        </div>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #1e293b; margin-top: 0;">Detalhes do Pacote</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #475569;"><strong>Descrição:</strong></td>
              <td style="padding: 8px 0; color: #1e293b;">{packageDescription}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #475569;"><strong>Loja:</strong></td>
              <td style="padding: 8px 0; color: #1e293b;">{store}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #475569;"><strong>Número do Pedido:</strong></td>
              <td style="padding: 8px 0; color: #1e293b;">{orderNumber}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #475569;"><strong>Data de Recebimento:</strong></td>
              <td style="padding: 8px 0; color: #1e293b;">{receivedDate}</td>
            </tr>
          </table>
        </div>
        
        <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <p style="color: #1e40af; margin: 0; line-height: 1.6;">
            <strong>Próximo passo:</strong> Você pode adicionar este pacote a uma caixa de consolidação ou criar uma nova caixa.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="{dashboardUrl}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Ver Pacotes
          </a>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #64748b; font-size: 14px;">
          <p>Equipe Euaconecta</p>
        </div>
      </div>
    `
  },
  {
    id: 'consolidation_ready_template',
    name: 'Consolidação Pronta',
    subject: '📦 Sua Consolidação Está Pronta! - Euaconecta',
    type: 'consolidation_ready',
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #059669; margin: 0;">📦 Consolidação Pronta!</h1>
        </div>
        
        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #14532d; margin-top: 0;">Olá {userName}!</h2>
          <p style="color: #166534; line-height: 1.6;">
            Sua consolidação foi finalizada e está pronta para envio!
          </p>
        </div>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #1e293b; margin-top: 0;">Detalhes da Consolidação</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #475569;"><strong>ID da Caixa:</strong></td>
              <td style="padding: 8px 0; color: #1e293b;">{consolidationId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #475569;"><strong>Número de Pacotes:</strong></td>
              <td style="padding: 8px 0; color: #1e293b;">{packageCount}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #475569;"><strong>Peso Total:</strong></td>
              <td style="padding: 8px 0; color: #1e293b;">{totalWeight}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #475569;"><strong>Valor Total:</strong></td>
              <td style="padding: 8px 0; color: #1e293b;">{totalValue}</td>
            </tr>
          </table>
        </div>
        
        <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <p style="color: #1e40af; margin: 0; line-height: 1.6;">
            <strong>Próximo passo:</strong> Faça o pagamento para que possamos enviar sua consolidação.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="{paymentUrl}" style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Fazer Pagamento
          </a>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #64748b; font-size: 14px;">
          <p>Equipe Euaconecta</p>
        </div>
      </div>
    `
  },
  {
    id: 'shipment_sent_template',
    name: 'Envio Realizado',
    subject: '🚚 Sua Consolidação Foi Enviada! - Euaconecta',
    type: 'shipment_sent',
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #7c3aed; margin: 0;">🚚 Enviado!</h1>
        </div>
        
        <div style="background: #faf5ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #6b21a8; margin-top: 0;">Olá {userName}!</h2>
          <p style="color: #7c2d12; line-height: 1.6;">
            Sua consolidação foi enviada com sucesso!
          </p>
        </div>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #1e293b; margin-top: 0;">Detalhes do Envio</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #475569;"><strong>Código de Rastreamento:</strong></td>
              <td style="padding: 8px 0; color: #1e293b; font-family: monospace; font-weight: bold;">{trackingCode}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #475569;"><strong>Transportadora:</strong></td>
              <td style="padding: 8px 0; color: #1e293b;">{carrier}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #475569;"><strong>Data de Envio:</strong></td>
              <td style="padding: 8px 0; color: #1e293b;">{shipmentDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #475569;"><strong>Previsão de Entrega:</strong></td>
              <td style="padding: 8px 0; color: #1e293b;">{estimatedDelivery}</td>
            </tr>
          </table>
        </div>
        
        <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <p style="color: #1e40af; margin: 0; line-height: 1.6;">
            <strong>Rastreamento:</strong> Use o código de rastreamento acima para acompanhar sua entrega no site da transportadora.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="{trackingUrl}" style="background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Rastrear Envio
          </a>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #64748b; font-size: 14px;">
          <p>Obrigado por escolher a Euaconecta!</p>
          <p>Equipe Euaconecta</p>
        </div>
      </div>
    `
  }
]

async function seedEmailTemplates() {
  try {
    console.log('🌱 Iniciando seed dos templates de email...')

    for (const template of defaultTemplates) {
      const existing = await prisma.emailTemplate.findUnique({
        where: { id: template.id }
      })

      if (existing) {
        console.log(`📧 Template ${template.name} já existe, atualizando...`)
        await prisma.emailTemplate.update({
          where: { id: template.id },
          data: {
            name: template.name,
            subject: template.subject,
            content: template.content,
            type: template.type,
            isActive: true
          }
        })
      } else {
        console.log(`📧 Criando template ${template.name}...`)
        await prisma.emailTemplate.create({
          data: template
        })
      }
    }

    console.log('✅ Seed dos templates de email concluído!')
  } catch (error) {
    console.error('❌ Erro no seed dos templates de email:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedEmailTemplates()
