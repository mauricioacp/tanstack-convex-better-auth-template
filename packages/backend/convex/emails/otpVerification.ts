export function otpVerificationEmailHtml(
	otp: string,
	userName: string,
): string {
	return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="background-color:#f6f9fc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;margin:0;padding:0">
  <div style="background-color:#ffffff;margin:0 auto;padding:20px 0 48px;margin-bottom:64px;max-width:560px">
    <div style="padding:0 48px">
      <p style="font-size:24px;font-weight:bold;margin-bottom:24px">Verify Your Email</p>
      <p style="font-size:16px;line-height:26px;color:#333">Hi ${userName},</p>
      <p style="font-size:16px;line-height:26px;color:#333">
        Use the following code to verify your email address:
      </p>
      <p style="font-size:36px;font-weight:bold;letter-spacing:8px;text-align:center;padding:16px 0;margin:24px 0;background-color:#f4f4f5;border-radius:6px;color:#000">
        ${otp}
      </p>
      <p style="font-size:16px;line-height:26px;color:#333">
        This code expires in 10 minutes. If you didn't create an account, you can safely ignore this email.
      </p>
      <hr style="border-color:#e6ebf1;margin:20px 0" />
      <p style="color:#8898aa;font-size:12px">Acme</p>
    </div>
  </div>
</body>
</html>`;
}
