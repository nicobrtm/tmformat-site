import { MercadoPagoConfig, Payment } from 'mercadopago';

// Configura o cliente com o token de acesso (variável de ambiente)
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

export default async function handler(req, res) {
  // Apenas aceita método GET (pois estamos consultando dados)
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query; // Recebe o ID do pagamento da URL (?id=123)
  
  if (!id) {
    return res.status(400).json({ error: 'ID do pagamento é obrigatório' });
  }

  try {
    const payment = new Payment(client);
    // Consulta o status do pagamento no Mercado Pago
    const response = await payment.get({ id });
    
    // Retorna o status atual (approved, pending, rejected, etc.)
    res.status(200).json({ status: response.status });
  } catch (error) {
    console.error("Erro ao verificar status:", error);
    res.status(500).json({ error: 'Erro ao verificar pagamento' });
  }
}