import { createTransport } from "nodemailer";

interface EmailOptions {
  email: string;
  subject: string;
  message: string;
}

const sendEmail = async ({
  email,
  subject,
  message,
}: EmailOptions): Promise<void> => {
  const transporter = createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: "Peter Refaat <peter@natours.dev>",
    to: email,
    subject,
    text: message,
  });
};

export default sendEmail;
