export function resetPasswordEmailHtml(url: string, userName: string): string {
	return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="background-color:#f6f9fc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;margin:0;padding:0">
  <div style="background-color:#ffffff;margin:0 auto;padding:20px 0 48px;margin-bottom:64px;max-width:560px">
    <div style="padding:0 48px">
      <p style="font-size:24px;font-weight:bold;margin-bottom:24px">Reset Your Password</p>
      <p style="font-size:16px;line-height:26px;color:#333">Hi ${userName},</p>
      <p style="font-size:16px;line-height:26px;color:#333">
        We received a request to reset your password. Click the button below to choose a new password.
      </p>
      <a href="${url}" style="background-color:#000;border-radius:6px;color:#fff;font-size:16px;text-decoration:none;text-align:center;display:block;padding:12px 24px;margin:24px 0">
        Reset Password
      </a>
      <p style="font-size:16px;line-height:26px;color:#333">
        If you didn't request a password reset, you can safely ignore this email.
      </p>
      <hr style="border-color:#e6ebf1;margin:20px 0" />
      <p style="color:#8898aa;font-size:12px">Acme</p>
    </div>
  </div>
</body>
</html>`;
}
