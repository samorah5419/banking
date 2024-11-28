require("dotenv").config(); // Load environment variables

const nodemailer = require("nodemailer");

// Create a transporter using the environment variables
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST_NAME, // Ensure the correct host is specified
  port: 465, // SSL port, change if you're using TLS (587 is common for TLS)
  secure: true, // Set to true for SSL (false for TLS)
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
  // You may also add these options if needed for TLS
  // requireTLS: true,
  // tls: { rejectUnauthorized: false }
});

// Function to send email with retry mechanism
const sendEmail = async (to, subject, text, html, retries = 3) => {
  try {
    // Setup email data
    const mailOptions = {
      from: process.env.EMAIL,
      to: to,
      subject: subject,
      text: text,
      html: html,
    };

    let info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);

    if (retries > 0 && !isClientError(error)) {
      console.log(`Retrying... Attempts left: ${retries}`);
      return sendEmail(to, subject, text, html, retries - 1);
    } else {
      throw error;
    }
  }
};

const isClientError = (error) => {
  return error.responseCode >= 400 && error.responseCode < 500;
};

module.exports = sendEmail;
