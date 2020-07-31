const nodemailer = require("nodemailer");
const DEBUG = false;

require("dotenv").config();

async function sendEmail(recipient, name = "") {
  let transporter;

  if (DEBUG === true) {
    // Initialize SMTP transporter.
    transporter = nodemailer.createTransport({
      host: `${process.env.MAILTRAP_HOST}`,
      port: process.env.MAILTRAP_PORT,
      auth: {
        user: `${process.env.MAILTRAP_USER}`,
        pass: `${process.env.MAILTRAP_PASS}`
      }
    });
  } else {
    transporter = nodemailer.createTransport({
      host: `${process.env.SMTP_HOST}`,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
      auth: {
        user: `${process.env.USER_EMAIL}`,
        pass: `${process.env.USER_PASS}`,
      },
    });
  }

  const message = 
  `Hello${name !== "" ? " " + name : ""}, 
  \n\nYour package has been successfully delivered — check your mailbox!
  \n\nThank you for using our app!
  \n\t— Package delivery tracking team.`;

  // Send mail with defined transport object.
  const info = await transporter.sendMail({
    from: `<${process.env.USER_EMAIL}>`, 
    to: recipient, 
    subject: "Notice of Your Package Delivery.",
    text: message
  });

  // console.log("Message sent: %s", info.messageId);
}

// let email = "johndoe@mail.com";
// let username = "John Doe";
// console.log("Sending email to the client at " + email);
// sendEmail(email, username)
//   .then(()=> console.log("Email has been successfully sent!"))
//   .catch(err => console.log(err));

module.exports = sendEmail;