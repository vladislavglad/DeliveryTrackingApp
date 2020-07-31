const nodemailer = require("nodemailer");
require("dotenv").config();

async function sendEmail(recipient, name = "") {

  // Default SMTP transport.
  const transporter = nodemailer.createTransport({
    host: `${process.env.SMTP_HOST}`,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
    auth: {
      user: `${process.env.USER_EMAIL}`,
      pass: `${process.env.USER_PASS}`,
    },
  });

  // Send mail with defined transport object.
  const info = await transporter.sendMail({
    from: `"${process.env.USER_NAME}" <${process.env.USER_EMAIL}`, 
    to: recipient, 
    subject: "Notice of Your Package Delivery.",
    text: `Hello${name !== "" ? " " + name : ""}, \nYour package has been delivered!`,
  });

  // console.log("Message sent: %s", info.messageId);
}

//sendEmail("johndoe@gmail.com", "John Doe").catch(console.error);

module.exports = sendEmail;