import nodemailer, { SendMailOptions } from "nodemailer";
import settings from "../constants/settings";
import { InternalServerError } from "../constants/errors";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: settings.nodemailer.email,
    pass: settings.nodemailer.password,
  },
});

const sendMail = async (mailOptions: SendMailOptions) => {
  try {
    await transporter.sendMail({
      from: settings.nodemailer.email,
      ...mailOptions,
    });
  } catch (error: any) {
    throw new InternalServerError(error);
  }
};

export default sendMail;
