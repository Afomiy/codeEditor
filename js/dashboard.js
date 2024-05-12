
document.addEventListener('DOMContentLoaded', () => {
    const createProjectBtn = document.getElementById('createProjectBtn');
    const languageModal = document.getElementById('languageModal');
    const inviteModal = document.getElementById('inviteModal');

    createProjectBtn.addEventListener('click', () => {
        languageModal.style.display = 'block';
    });
    document.getElementById('chooseLanguageBtn').addEventListener('click', () => {
        const selectedLanguage = document.getElementById('languageSelect').value;
        console.log('Selected Language:', selectedLanguage);
        languageModal.style.display = 'none';
        window.location.href = '/editorPage?lang=' + selectedLanguage;
    });
    

    document.getElementById('sendInviteBtn').addEventListener('click', () => {
        const friendEmail = document.getElementById('friendEmail').value;
        console.log('Inviting friend:', friendEmail);
        inviteModal.style.display = 'none';
    });
    document.querySelectorAll('.close').forEach((closeBtn) => {
        closeBtn.addEventListener('click', () => {
            languageModal.style.display = 'none';
            inviteModal.style.display = 'none';
        });
    })
    
// dashboard.js
// dashboard.js

function sendEmailInvitation(email) {
    console.log('Inviting friend:', email); // Make sure the email is logged correctly
    fetch('/send-invitation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to send email invitation');
        }
        console.log('Email invitation sent successfully');
    })
    .catch(error => {
        console.error('Error sending email invitation:', error);
    });
}

// Example usage
sendEmailInvitation('helinabikes0@gmail.com'); // Pass the email as an argument


    document.querySelectorAll('.close').forEach((closeBtn) => {
        closeBtn.addEventListener('click', () => {
            languageModal.style.display = 'none';
            inviteModal.style.display = 'none';
        });
    });
    })
