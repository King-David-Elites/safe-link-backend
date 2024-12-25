import settings from "../constants/settings";
import { IUser } from "../interfaces/models/user.interface";

export const christmasEmailHTML = (user: IUser) => {
  return `<!DOCTYPE html>
<html lang="en">
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
        <h1>Merry Christmas from SafeLink</h1>
      </td>
    </tr>
    <!-- Thumbnail Image -->
    <tr>
      <img src="https://res.cloudinary.com/dkriotzd7/image/upload/v1735083881/Safelink_christmas_wz4iqm.png" alt="Christmas Thumbnail" style="max-width: 100%; border-radius: 10px;" />
    </tr>
    <!-- Body Section -->
    <tr>
      <td class="email-body">
        <h1>Jingle All the Way with SafeLink! 🎅🎄</h1>
        <p>Dear ${user.username},</p>
        <p>Season’s greetings from your <strong>SafeLink squad!</strong> 🎉 As the jollof hits the fire and the harmattan breeze sets the vibe, we’re here to say a BIG thank you for trusting us with your hustle this year. 🙌</p>
        <p>You’ve been incredible, and we’re super excited to keep helping you smash those goals in <strong>2025</strong>. For now, enjoy the festive vibes, spend time with your loved ones, and don’t forget to rest (just a little sha). You have really tried!</p>
        <p>Here’s to more sales, growth, and good vibes in the new year. 🥂 <strong>Merry Christmas and a Prosperous New Year!</strong> 🎁</p>
        <br>
        <p><strong>Cheers,</strong></p>
        <p><strong>The SafeLink Team 🌟</strong></p>
        <p>P.S. Watch out for exciting updates in January. Na big things we dey plan for you! 😉</p>
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
</html>
`;
};
