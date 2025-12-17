import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Segurança: só aceita método POST
  if (req.method !== 'POST') return res.status(405).end();

  const { email, pdfBase64, nome } = req.body;

  if (!email || !pdfBase64) {
    return res.status(400).json({ error: 'Dados incompletos' });
  }

  try {
    // Configuração do "Carteiro" (Gmail)
    // As senhas vêm das variáveis de ambiente da Vercel para segurança
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Seu e-mail
        pass: process.env.EMAIL_PASS, // Sua senha de aplicativo (NÃO é a senha normal)
      },
    });

    const mailOptions = {
      // AQUI ESTÁ O SEGREDO:
      // O nome "Equipe TmFormat" aparece em destaque para o cliente.
      // O e-mail dentro de < > deve ser o seu real para não cair no Spam.
      from: `"Equipe TmFormat" <${process.env.EMAIL_USER}>`, 
      to: email,
      subject: 'Seu Protocolo Metabólico Chegou! 🍃',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #16a34a;">Parabéns pela decisão, ${nome || 'Aluna'}!</h2>
          <p>O seu <strong>Protocolo Específico</strong> está pronto e anexado a este e-mail.</p>
          <p>Lembre-se: a consistência é a chave para reativar o seu metabolismo.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #888;">Este é um e-mail automático da TmFormat.</p>
        </div>
      `,
      attachments: [
        {
          filename: 'Protocolo_TmFormat_Premium.pdf',
          content: pdfBase64.split('base64,')[1], // Limpa o código do PDF para o anexo funcionar
          encoding: 'base64',
        },
      ],
    };

    // Envia o e-mail
    await transporter.sendMail(mailOptions);
    console.log(`Email enviado com sucesso para ${email}`);
    res.status(200).json({ success: true });

  } catch (error) {
    console.error('Erro ao enviar email:', error);
    res.status(500).json({ error: 'Falha no envio do e-mail' });
  }
}