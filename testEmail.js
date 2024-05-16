require('dotenv').config();
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
    to: '', // Replace with your email for testing
    from: 'your_verified_sender@example.com', // Use your verified sender
    subject: 'Test Email',
    text: 'This is a test email from WellBot using SendGrid',
};

sgMail.send(msg)
    .then(() => {
        console.log('Test email sent');
    })
    .catch((error) => {
        console.error('Error sending test email:', error);
    });
