const nodemailer = require('nodemailer');

/**
 * Email Service
 * Handles sending confirmation and welcome emails.
 */

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // generated ethereal user
    pass: process.env.EMAIL_PASS, // generated ethereal password
  },
});

const sendWelcomeEmail = async (userEmail, userName) => {
  if (!process.env.EMAIL_USER) {
    console.warn('⚠️ Email Service not configured. Set EMAIL_USER/PASS in .env');
    return;
  }

  const mailOptions = {
    from: `"HealMate Support" <${process.env.EMAIL_FROM || 'support@healmate.ai'}>`,
    to: userEmail,
    subject: 'Welcome to HealMate – Your Journey to Wellness Begins',
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #fcfaf7; border-radius: 24px; border: 1px solid #e5e0d8;">
        <div style="text-align: center; mb-40px;">
          <h1 style="color: #1a3a32; font-family: serif; font-size: 32px; margin-bottom: 8px;">HealMate</h1>
          <p style="text-transform: uppercase; letter-spacing: 0.2em; font-size: 10px; color: #a39c8f; font-weight: 800;">Sanctuary of Healing</p>
        </div>
        
        <h2 style="color: #1a3a32; font-size: 24px; font-weight: 600; margin-top: 40px;">Beautiful to have you, ${userName}.</h2>
        
        <p style="color: #4a4a4a; line-height: 1.6; font-size: 16px;">
          Your path to better health is now steady and supported. We're honored to accompany you on this journey.
        </p>
        
        <div style="background-color: #ffffff; border-radius: 16px; padding: 24px; margin: 32px 0; border: 1px solid #efeae2;">
          <h3 style="color: #1a3a32; font-size: 18px; margin-top: 0;">Next Steps</h3>
          <ul style="color: #4a4a4a; padding-left: 20px;">
            <li>Sync your prescriptions from your portal</li>
            <li>Enable smart reminders for worry-free care</li>
            <li>Add a caregiver for shared support</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin-top: 40px;">
          <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}" style="background-color: #1a3a32; color: #ffffff; padding: 16px 32px; border-radius: 100px; text-decoration: none; font-weight: 600; font-size: 14px; display: inline-block;">Go to Your Dashboard</a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #efeae2; margin: 40px 0;">
        
        <p style="font-size: 12px; color: #a39c8f; text-align: center;">
          HealMate — Privacy focused, AI driven, human centered.
        </p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent: %s', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};

const sendLoginConfirmation = async (userEmail, userName) => {
  if (!process.env.EMAIL_USER) return;

  const mailOptions = {
    from: `"HealMate Support" <${process.env.EMAIL_FROM || 'support@healmate.ai'}>`,
    to: userEmail,
    subject: 'New Sign-in to Your HealMate Account',
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #1a3a32;">Hello, ${userName}</h2>
        <p>A new sign-in was detected for your account at ${new Date().toLocaleString()}.</p>
        <p>If this was you, you can safely ignore this email. If not, please contact support immediately.</p>
        <p style="margin-top: 30px; font-size: 12px; color: #888;">HealMate Security Service</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending login notification:', error);
    return { success: false };
  }
};

module.exports = {
  sendWelcomeEmail,
  sendLoginConfirmation,
};
