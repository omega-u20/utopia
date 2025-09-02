import dotenv from 'dotenv';
dotenv.config();
import {
	MailerSend,
	EmailParams,
	Sender,
	Recipient
} from "mailersend";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

async function sendOTP(email) {

  if (!API_KEY) {
	throw new Error("API_KEY environment variable is not set.");
  }

  const mailerSend = new MailerSend({
	apiKey: API_KEY,
  });

  const adminEmail = "ocdesigner153@gmail.com";
  const verifiedSenderEmail = "no-reply@test-y7zpl9807r345vx6.mlsender.net"; // Replace with your verified domain email
  if (email !== adminEmail) {
	throw new Error("Trial accounts can only send emails to the administrator's email address.");
  }

  const sentFrom = new Sender(verifiedSenderEmail, "TESTER");

  const recipients = [
	new Recipient(adminEmail, "User")
  ];

  const htmlContent = `
	<p>Hey there!</p>
	<p>Your OTP code</p></br>
	<h2 style="color: blue;">123456</h2>
	<br>
	<p>Welcome to our platform, we're happy to have you here!</p>`;

  const emailParams = new EmailParams()
	.setFrom(sentFrom)
	.setTo(recipients)
	.setReplyTo(sentFrom)
	.setSubject("Welcome! Your OTP is here.")
	.setHtml(htmlContent)
	.setText("Hey there! Your OTP code is 123456. Welcome to our platform, we're happy to have you here!");

  try {
	const response = await mailerSend.email.send(emailParams);
	console.log("Email sent successfully:");
  
	return true;
  } catch (error) {
	console.error("Error sending email:", error);
	return false;
  }
}

export { sendOTP };
