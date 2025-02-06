const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST_NAME,
  port: 465,
  secure: true, // true for 465 port (SSL)
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    minVersion: "TLSv1.2", // Force TLSv1.2 for compatibility
  },
});

// Function to send email with retry mechanism
const sendEmail = async (
  to,
  subject,
  text,
  html,
  retries = 3,
  delay = 1000
) => {
  try {
    // Setup email data
    const mailOptions = {
      from: process.env.EMAIL,
      to: to,
      subject: subject,
      text: text,
      html: html,
    };

    // Send email with defined transport object
    let info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);

    // Retry only for network-related errors, timeouts, or server errors (e.g., connection issues)
    if (retries > 0 && shouldRetry(error)) {
      console.log(`Retrying... Attempts left: ${retries}`);
      await sleep(delay); // Delay before retry
      return sendEmail(to, subject, text, html, retries - 1, delay);
    } else {
      throw error;
    }
  }
};

// Function to check if the error is a network or server-related error (non-client errors)
const shouldRetry = (error) => {
  return (
    error.code === "ETIMEDOUT" || // Connection timeout
    error.code === "ENOTFOUND" || // DNS resolution issues
    error.code === "ECONNREFUSED" || // Connection refused
    (error.responseCode && error.responseCode >= 500) // Server errors (5xx)
  );
};

//  tFunctiono add delay between retries
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports = sendEmail;
