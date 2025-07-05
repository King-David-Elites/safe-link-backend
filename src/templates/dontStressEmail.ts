import settings from "../constants/settings";
import { IUser } from "../interfaces/models/user.interface";

export const dontStressEmailHTML = (user: IUser) => {
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
      background-color: #0D6EFD;
      color: #ffffff;
      font-weight: bold;
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
        <h1>Less Stress, More Sales This Weekend</h1>
      </td>
    </tr>
    <!-- Thumbnail Image -->
    <tr>
      <img src="https://res.cloudinary.com/dvs8hrjsk/image/upload/v1751734154/dontstress_lxjkbk.jpg" alt="Dont stress with WhatsApp Thumbnail" style="max-width: 100%; border-radius: 10px;" />
    </tr>
    <!-- Body Section -->
    <tr>
      <td class="email-body">
        <p>Dear ${user.username},</p>
        <h1>We know how weekends can be —</h1>
        <p>You want to relax, catch your breath, maybe even take a break…</p>
        <p>But instead, you’re replying:<br>
        “Send more pictures.”<br>
        “How much again?”<br>
        “Do you have other colors?”
        </p>

        <p><strong>It’s exhausting.</strong><br>
        And it’s not the way business should feel.</p>
        <p><strong>That’s exactly why we created Safelink.</strong><br>
        So you can show your products, prices, and links in one simple place…<br>
        and just share <strong>one link </strong> when customers ask.</p>
        
        <p>You’ve already signed up (and that’s a big step 💛).<br>
        Now, let this weekend be the one where you set it up and actually use it.</p>
        
        <h2>Here’s how to get started:</h2>
        <ul>
            <li>✅ Add your product images</li>
            <li>✅ Write out your prices and info</li>
            <li>✅ Share your Safelink instead of repeating yourself</li>
        </ul>

        <h2>And one last thing:</h2>
        <p>If Safelink is helping you even a little,<br>
        please tell a friend this weekend.<br>
        You never know who’s quietly stressed and needs this too.</p>

        <p><strong>We’re rooting for you, always.</strong><br>
        Less stress. More ease. One smart link at a time.</p>

        <p>
            Warm regards,<br>
            <strong>The Safelink Team</strong><br>
            <a href="https://www.joinsafelink.com" target="_blank">www.joinsafelink.com</a>
        </p>

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

