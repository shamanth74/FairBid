import nodemailer from 'nodemailer';

export const transporter=nodemailer.createTransport({
    host:process.env.SMTP_HOST,
    port: 587,
    secure:false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    }
})

export const sendWinnerMail = async ({ to, name, title, amount }) => {
  await transporter.sendMail({
    from: `"BidByte" <${process.env.SMTP_FROM}>`,
    to,
    subject: `🎉 You won the auction: ${title}`,
    html: `
      <div style="font-family: Arial, sans-serif">
        <h2>Congratulations ${name} 🎉</h2>
        <p>You have won the auction <b>${title}</b>.</p>
        <p><b>Winning bid:</b> ₹${amount}</p>
        <p>Please visit BidByte to see your auction.</p>
        <br />
        <p>— BidByte Team</p>
      </div>
    `,
  });
};