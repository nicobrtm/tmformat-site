import { MercadoPagoConfig, Payment } from 'mercadopago';

// O token vem das variáveis de ambiente da Vercel (Configurado no painel da Vercel)
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const payment = new Payment(client);
    
    const body = {
      transaction_amount: 24.90, // VALOR DE TESTE (Altere para 24.90 quando for vender)
      description: 'Protocolo TmFormat - Teste',
      payment_method_id: 'pix',
      payer: {
        email: 'teste@email.com', // Pode pegar do req.body.email se quiser dinâmico
        first_name: 'Cliente',
        identification: { 
            type: 'CPF', 
            number: '19119119100' // CPF genérico necessário para gerar Pix sem erro
        }
      }
    };

    const response = await payment.create({ body });
    
    // Retorna os dados necessários para o Frontend exibir o QR Code
    res.status(200).json({
      id: response.id,
      qr_code: response.point_of_interaction.transaction_data.qr_code,
      qr_code_base64: response.point_of_interaction.transaction_data.qr_code_base64,
      ticket_url: response.point_of_interaction.transaction_data.ticket_url
    });

  } catch (error) {
    console.error("Erro no Mercado Pago:", error);
    res.status(500).json({ error: 'Erro ao criar Pix' });
  }
}