const nodemailer = require('nodemailer');

async function sendInvitation(email, invitationLink,projectId) {
    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'afomiyaaddis21@gmail.com',
                pass: 'vsta rris iyoe avfx'
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        let info = await transporter.sendMail({
            from: '"Sender Name" <sender@example.com>',
            to: email,
            subject: 'Invitation to Collaborate',
            text: `You have been invited to collaborate on a project. Click the following link to join: ${invitationLink}`,
            html:  `<p>You have been invited to collaborate on a project. Click the following link to join:</p><p><a href="${invitationLink}">${invitationLink}</a></p>`
        });

        console.log('Message sent: %s', info.messageId);
        console.log('Invitation link:', invitationLink);
        console.log('Project ID:', projectId);
    } catch (error) {
        console.error('Error sending email invitation:', error);
    }
}

module.exports = { sendInvitation };
