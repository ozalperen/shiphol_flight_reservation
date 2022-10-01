import nodemailer from "nodemailer";
import { User } from "../entities/user.entity";
import config from "config";
import pug from "pug";
import { convert } from "html-to-text";

const smtp = config.get<{
  host: string;
  port: number;
  secure: true;
  user: string;
  pass: string;
}>("smtp");

export default class Email {
  firstName: string;
  to: string;
  from: string;
  constructor(public user: User, public url: string) {
    this.firstName = user.name.split(" ")[0];
    this.to = user.email;
    this.from = `Codevo ${config.get<string>("emailFrom")}`;
  }

  private newTransport() {
    return nodemailer.createTransport({
      ...smtp,
      auth: {
        user: smtp.user,
        pass: smtp.pass,
      },
    });
  }

  private async send(
    template: string,
    subject: string,
    body: string,
    salutation: string
  ) {
    // Generate HTML template based on the template string
    let html =
      salutation +
      this.firstName +
      "," +
      "<br><br>" +
      body +
      "<br><br>" +
      "<a href='" +
      this.url +
      "'>" +
      this.url +
      "</a>";
    // Create mailOptions
    const mailOptions = {
      from: smtp.user,
      to: this.to,
      subject: subject,
      html: html,
    };

    // Send email
    const info = await this.newTransport().sendMail(mailOptions);
    console.log(nodemailer.getTestMessageUrl(info));
  }

  async sendPasswordUpdateCode() {
    await this.send(
      "passwordUpdateCode",
      "Reset Your Password",
      "Please copy and paste your password resed code:",
      "Hello "
    );
  }

  async sendVerificationCode() {
    await this.send(
      "verificationCode",
      "Verify Your Account",
      "Activate your account by clicking the following link:",
      "Hello "
    );
  }

  async sendPasswordResetToken() {
    await this.send(
      "resetPassword",
      "Your password reset token (valid for only 10 minutes)",
      "Your password reset token (valid for only 10 minutes)",
      "Hello, "
    );
  }
}
