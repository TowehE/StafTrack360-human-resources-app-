
const welcomeEmail = (fullName, email, password, link, businessName) => {
    // Determine the greeting based on whether firstName or email is available
    let greeting = "";
    if (fullName) {
        greeting = `Hi ${fullName},`;
    } else if (email) {
        // Extract the username from the email and append "@gmail.com"
        const username = email.split('@')[0];
        greeting = `Hi ${username}@gmail.com,`;
    } else {
        greeting = "Hi there,";
    }

    // Construct and return the email template
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Receive Email</title>
        </head>
        <body>
            <h1>Welcome to our team!</h1>
            <p>${greeting}</p>
            <p>You've been invited to join ${businessName} on StafTrack360. Your login credentials are:</p>
            <ul>
                <li>Username: ${email}</li>
                <li>Password: ${password}</li>
            </ul>
            <p>Please keep this information secure.</p>
            <p>Click <a href="${link}">here</a> to log in.</p>
        </body>
        </html>
    `;
};

module.exports = { welcomeEmail };
