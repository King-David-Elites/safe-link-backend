import settings from "../constants/settings";
import { IUser } from "../interfaces/models/user.interface";

export const julyGreetingsEmailHTML = (user: IUser) => {
  return `<!DOCTYPE html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    /* Global styles */
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      color: #333;
    }
    table {
      border-spacing: 0;
      width: 100%;
      background-color: #f4f4f4;
    }
    img {
      max-width: 100%;
      height: auto;
      display: block;
    }
    a {
      color: #007BFF;
      text-decoration: none;
    }
    /* Main container */
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
    }
    .email-header {
      background-color: #f2be5c;
      color: #ffffff;
      text-align: center;
      padding: 20px 10px;
    }
    .email-body {
      padding: 20px;
      line-height: 1.6;
    }
    .email-body h1 {
      color: #333333;
      font-size: 20px;
    }
    .email-body p {
      margin: 10px 0;
    }
    .btn {
      display: inline-block;
      margin: 20px 0;
      padding: 12px 20px;
      background-color: #f2be5c;
      color: #ffffff;
      text-decoration: none;
      border-radius: 5px;
      font-size: 16px;
    }
    .email-footer {
      background-color: #f9f9f9;
      text-align: center;
      padding: 20px 10px;
      font-size: 14px;
      color: #666666;
    }
    .social-icons a {
      margin: 0 5px;
      display: inline-block;
    }
  </style>
</head>
<body>
  <table class="email-container">
    <!-- Header Section -->
    <tr>
      <td class="email-header">
        <img align="center" border="0" src="https://cdn.templates.unlayer.com/assets/1597218650916-xxxxc.png" alt="SafeLink Logo" title="SafeLink Logo" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 26%;max-width: 150.8px;" width="150.8" />
        <h1>New Month Greetings</h1>
      </td>
    </tr>
    <!-- Thumbnail Image -->
    <tr>
      <img src="https://res.cloudinary.com/dvs8hrjsk/image/upload/v1751400019/julygreetings_gmwjds.jpg" alt="July Greetings Thumbnail" style="max-width: 100%; border-radius: 10px;" />
    </tr>
    <!-- Body Section -->
    <tr>
      <td class="email-body">
        <h1>Wishing You a Joyous July from Safelink! 🌟</h1>
        <p>Dear ${user.username},</p>
        <p>Happy new month! 🎉 We hope July brings you endless opportunities, joy, and success. </p>

        <p>We're thrilled to have you as part of the Safelink community and appreciate your trust in our platform.</p>

        <p>At Safelink, we're committed to helping your business stand out among peers and shine in the digital space. Our platform is still active and ready to help you create a unique online presence that showcases your products and services.</p>

        <p>We're always looking for ways to improve and would love to hear from you! </p>
        
        <p>DIf you have any feedback, suggestions, or concerns, please don't hesitate to reach out to us directly.</br>✉: <a href="mailto:usesafelink@gmail.com">usesafelink@gmail.com</a> </br>📲: <strong>0704 173 3196</strong></p>

        <p>Thank you for believing in Safelink and the Africa's dream. We're excited to see your business grow and thrive! 🚀</p>
         
        <p>Warm regards,<br>
        <strong>The Safelink Management Team.</strong></p>

      </td>
    </tr>
    <!-- Footer Section -->
    <tr>
      <td class="email-footer">
        <p><strong>Get in touch</strong></p>
        <p>
          <a href="tel:+2347041733196">+234 704 173 3196</a> |
          <a href="mailto:usesafelink@gmail.com">usesafelink@gmail.com</a>
        </p>
        <div class="social-icons">
          <a href="https://facebook.com"><img src="https://cdn.tools.unlayer.com/social/icons/circle-black/facebook.png" width=32 alt="Facebook"></a>
          <a href="https://linkedin.com"><img src="https://cdn.tools.unlayer.com/social/icons/circle-black/linkedin.png" width=32 alt="LinkedIn"></a>
          <a href="https://instagram.com"><img src="https://cdn.tools.unlayer.com/social/icons/circle-black/instagram.png" width=32 alt="Instagram"></a>
          <a href="https://youtube.com"><img src="https://cdn.tools.unlayer.com/social/icons/circle-black/youtube.png" width=32 alt="YouTube"></a>
        </div>
        <p>&copy; 2024 SafeLink. All Rights Reserved.</p>
      </td>
    </tr>
  </table>
</body>
</!DOCTYPE>
`;
};

