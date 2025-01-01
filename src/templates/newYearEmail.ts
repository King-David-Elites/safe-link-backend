import settings from "../constants/settings";
import { IUser } from "../interfaces/models/user.interface";

export const newYearEmailHTML = (user: IUser) => {
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
        <h1>New Year Greetings from SafeLink</h1>
      </td>
    </tr>
    <!-- Thumbnail Image -->
    <tr>
      <img src="https://res.cloudinary.com/dkriotzd7/image/upload/v1735720485/Newyear_bkuzn5.jpg" alt="Christmas Thumbnail" style="max-width: 100%; border-radius: 10px;" />
    </tr>
    <!-- Body Section -->
    <tr>
      <td class="email-body">
        <h1>2025 Will Be Bigger and Better with SafeLink! 🎉</h1>
        <p>Dear ${user.username},</p>
        <p>2024 was amazing, and you played a big role in making SafeLink the success it is today. Thank you for trusting us with your business. You’ve not just been a user—you’re family, and we’re grateful. 🙏</p>

        <p>Now, let’s talk about 2025 and how you can win BIGGER with SafeLink:</p>

        <strong>1. Build Your Catalogue, Build Your Freedom!</strong>
        <p>If you haven’t uploaded your products yet, now is the time to do it. Your SafeLink profile is your one-stop shop—a link that stores all your products in one place and makes life so much easier.</p>

        <p>Here’s why you should:</p>
        <ul>
            <li><strong>More Family Time:</strong> Spend more moments with loved ones while your link does the selling.</li>
            <li><strong>More Customers, More Referrals:</strong> Share your link easily with anyone, anywhere. Plus, your happy customers can also refer you without stress!</li>
            <li><strong>More Money:</strong> The easier it is for people to see your products, the more they buy, and the more profits roll in.</li>
        </ul>
        <p>Don’t just sell—thrive. Start uploading your products now, and let SafeLink do the heavy lifting for you.</p>

        <strong>2. A Toast to You for 2024! 🍾</strong>
        <p>Thank you for being one of the pillars of SafeLink’s success last year. Your trust, hustle, and referrals kept us thriving, and we’re pumped to help you do even more in 2025.</p>
        <p>SafeLink is not just about helping you sell. This year, we’ll be introducing even more ways for you to make money outside of just buying and selling. Stay tuned for exciting updates soon!</p>

        <p><strong>Happy New Year, Fam! 🎆🎉</strong></p>
        <p>Here’s to a profitable 2025! 🥂,<br>
        <strong>The SafeLink Team 💛</strong></p>

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
