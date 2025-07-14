import settings from "../constants/settings";
import { IUser } from "../interfaces/models/user.interface";

export const fridayNotificationEmailHTML = (user: IUser) => {
  return `<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Safelink Weekly Newsletter</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
      font-family: 'Segoe UI', Arial, sans-serif;
      color: #333;
    }

    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .email-header {
      background-color: #0D6EFD;
      color: #ffffff;
      text-align: center;
      padding: 30px 20px 20px;
    }

    .email-header img {
      width: 140px;
      margin-bottom: 10px;
    }

    .email-header h1 {
      margin: 10px 0 0;
      font-size: 22px;
      font-weight: 600;
    }

    .thumbnail img {
      width: 100%;
      display: block;
      border-radius: 0;
    }

    .email-body {
      padding: 25px 20px;
      line-height: 1.7;
      font-size: 15px;
    }

    .email-body h1 {
      font-size: 18px;
      margin-bottom: 10px;
    }

    .email-body ul {
      padding-left: 20px;
      margin: 15px 0;
    }

    .email-body ul li {
      margin-bottom: 15px;
    }

    .cta-button {
      display: inline-block;
      margin: 25px 0 15px;
      padding: 12px 24px;
      background-color: #f2be5c;
      color: #fff !important;
      text-decoration: none;
      font-weight: bold;
      border-radius: 5px;
      font-size: 16px;
      transition: background-color 0.3s ease;
    }

    .cta-button:hover {
      background-color: #e2ac49;
    }

    .email-footer {
      background-color: #f9f9f9;
      text-align: center;
      padding: 20px;
      font-size: 14px;
      color: #666;
    }

    .email-footer a {
      color: #0D6EFD;
      text-decoration: none;
    }

    .social-icons {
      margin: 10px 0;
    }

    .social-icons a {
      margin: 0 5px;
      display: inline-block;
    }

    .social-icons img {
      width: 30px;
      height: 30px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="email-header">
      <img src="https://res.cloudinary.com/dvs8hrjsk/image/upload/v1752452916/logo_fgxd4u.png" alt="Safelink Logo" title="Safelink Logo" />
      <h1>Stay Consistent. Stay Visible. Let Safelink Help You Win.</h1>
    </div>

    <!-- Thumbnail -->
    <div class="thumbnail">
      <img src="https://res.cloudinary.com/dvs8hrjsk/image/upload/v1752414955/GiveUp_gp8z32.jpg" alt="Keep Going" />
    </div>

    <!-- Body -->
    <div class="email-body">
      <p>Dear ${user.username},</p>

       <p>Whether you're resting, planning, or pushing through this weekend, here’s something we want you to remember:</p>

      <ul>
        <li><strong>👉 You’ve already come too far to quit now.</strong></li>
        <li><strong>👉 Every little effort you make is building something bigger.</strong></li>
        <li><strong>👉 Consistency is your secret weapon.</strong></li>
      </ul>

      <p>We know the journey gets tough sometimes — but the truth is, your dream is still valid. Your work is not wasted. And your present situation does not define your final destination.</p>

      <blockquote>“Success is not just what you get, it’s who you become.”</blockquote>

      <p>At <strong>Safelink</strong>, we’re cheering you on — helping you stay visible and professional so your hustle never goes unnoticed.</p>

      <p class="closing">Enjoy your weekend, ${user.username}.<br>
      Reflect. Recharge. And get ready to show up again!</p>

      <p class="signature"><strong>The Safelink Team</strong></p>
      <p><a href="https://www.joinsafelink.com" class="website">www.joinsafelink.com</a></p>

      <p class="footer-note">📩 Need anything? Get in touch using the contact info at the bottom of this email.</p>
    </div>

    <!-- Footer -->
    <div class="email-footer">
      <p><strong>Get in touch</strong></p>
      <p>
        <a href="tel:+2347041733196">+234 704 173 3196</a> |
        <a href="mailto:usesafelink@gmail.com">usesafelink@gmail.com</a>
      </p>

      <div class="social-icons">
        <a href="https://facebook.com"><img src="https://cdn.tools.unlayer.com/social/icons/circle-black/facebook.png" alt="Facebook"></a>
        <a href="https://linkedin.com"><img src="https://cdn.tools.unlayer.com/social/icons/circle-black/linkedin.png" alt="LinkedIn"></a>
        <a href="https://instagram.com"><img src="https://cdn.tools.unlayer.com/social/icons/circle-black/instagram.png" alt="Instagram"></a>
        <a href="https://youtube.com"><img src="https://cdn.tools.unlayer.com/social/icons/circle-black/youtube.png" alt="YouTube"></a>
      </div>

      <p>&copy; 2024 Safelink. All Rights Reserved.</p>
    </div>
  </div>
</body>
</html>
`;
};

