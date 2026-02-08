export function contactNotificationEmailHtml(
	name: string,
	email: string,
	message: string,
): string {
	return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="background-color:#f6f9fc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;margin:0;padding:0">
  <div style="background-color:#ffffff;margin:0 auto;padding:20px 0 48px;margin-bottom:64px;max-width:560px">
    <div style="padding:0 48px">
      <p style="font-size:24px;font-weight:bold;margin-bottom:24px">New Contact Form Submission</p>
      <p style="font-size:16px;line-height:26px;color:#333"><strong>From:</strong> ${name} (${email})</p>
      <div style="background-color:#f4f4f5;border-radius:6px;padding:16px;margin:24px 0">
        <p style="font-size:16px;line-height:26px;color:#333;white-space:pre-wrap;margin:0">${message}</p>
      </div>
      <hr style="border-color:#e6ebf1;margin:20px 0" />
      <p style="color:#8898aa;font-size:12px">Acme — Contact Form Notification</p>
    </div>
  </div>
</body>
</html>`;
}
