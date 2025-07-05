const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendReminderEmail(userEmail, userName, plantName, reminderTitle, reminderDescription) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `🌱 Plant Care Reminder: ${reminderTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2e7d32;">🌱 Plant Care Reminder</h2>
          <p>Hello ${userName},</p>
          <p>It's time to take care of your plant <strong>${plantName}</strong>!</p>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2e7d32; margin-top: 0;">${reminderTitle}</h3>
            <p>${reminderDescription}</p>
          </div>
          <p>Keep your plants healthy and happy! 🌿</p>
          <p>Best regards,<br>Your AI Plant Care Assistant</p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Reminder email sent to ${userEmail}`);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}

module.exports = new EmailService(); 