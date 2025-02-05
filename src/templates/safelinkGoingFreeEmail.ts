import settings from "../constants/settings";
import { IUser } from "../interfaces/models/user.interface";

export const safelinkFreeEmailHTML = (user: IUser) => {
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
        <h1>Building your businesses with Safelink</h1>
      </td>
    </tr>
    <!-- Thumbnail Image -->
    <tr>
      <img src="https://res.cloudinary.com/dkriotzd7/image/upload/v1738740285/Safelink-free_ufvhc1.png" alt="Safelinke Going Free Thumbnail" style="max-width: 100%; border-radius: 10px;" />
    </tr>
    <!-- Body Section -->
    <tr>
      <td class="email-body">
        <h1>ACTIVATE YOUR BUSINESS SUCCESS NOW! </h1>
        <p>Dear ${user.username},</p>
        <p>We’re so excited to have you with us! Your success means everything to us, and that’s why SafeLink has been made completely free— Now we also help you grow, scale, and access business loans and grants when you need them, all on our platform. 🚀</p>

        <p>✨ If you’ve registered but haven’t uploaded your catalogue yet
        Your online store is ready—just waiting for your amazing products! 🛍 Uploading your catalogue helps you attract more customers and boost your profits. It’s quick, easy, and 100% free! Let’s get your business online and thriving.</p>

        <p>🔗 If you’ve uploaded your catalogue but haven’t shared your link
        You have a beautiful online presence—now let’s get it seen! 📢 Share your SafeLink website everywhere—WhatsApp, Instagram, Facebook, and with your contacts. More views = More sales = More chop life! 💰</p>

        <p>🤝 If you’re already sharing your link—well done!</p>
        Keep going! But don’t stop there—help other business owners discover SafeLink too. The more we grow together, the more we all win! 🏆

        <p>At SafeLink, it’s all about MORE MONEY + MORE TIME = CHOP LIFE! 🎉</p>

        <p>We’re here to support you every step of the way. Let’s make 2025 your best business year yet! 🚀💙</p>
        <p><strong>The SafeLink Team 💛</strong></p>

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
