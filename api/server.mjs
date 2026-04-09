import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Wrong method' });
  }

  try {
    const { name, message, email } = req.body;

    const data = await resend.emails.send({
      from: 'Portfolio <onboarding@resend.dev>',
      to: 'a01646946@tec.mx',
      subject: `New message from ${name}`,
      html: `
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    });

    return res.status(200).json({ data });
  } catch (error) {
    return res.status(502).json({ error });
  }
};

export default handler;