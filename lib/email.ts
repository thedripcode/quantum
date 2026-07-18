import { Resend } from 'resend';

const FROM = 'Sidelile High School <noreply@sidelile.edu.za>';

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY is not set');
  return new Resend(key);
}

export async function sendPasswordResetEmail(to: string, resetToken: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

  await getResend().emails.send({
    from: FROM,
    to,
    subject: 'Reset your Sidelile portal password',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;background:#0C0C0C;color:#fff;border-radius:16px;overflow:hidden;">
        <div style="background:#C9A84C;padding:24px 32px;">
          <h1 style="margin:0;font-size:22px;font-weight:800;color:#000;letter-spacing:-0.03em;">SIDELILE HIGH SCHOOL</h1>
          <p style="margin:4px 0 0;font-size:12px;color:rgba(0,0,0,0.6);letter-spacing:0.12em;text-transform:uppercase;">Password Reset</p>
        </div>
        <div style="padding:32px;">
          <p style="font-size:15px;color:rgba(255,255,255,0.75);margin:0 0 20px;">You requested a password reset for your Sidelile portal account.</p>
          <p style="font-size:15px;color:rgba(255,255,255,0.75);margin:0 0 28px;">Click the button below to set a new password. This link expires in <strong style="color:#fff;">1 hour</strong>.</p>
          <a href="${resetUrl}" style="display:inline-block;background:#C9A84C;color:#000;text-decoration:none;padding:13px 28px;border-radius:10px;font-weight:700;font-size:15px;">Reset My Password</a>
          <p style="margin:28px 0 0;font-size:12px;color:rgba(255,255,255,0.35);">If you didn't request this, ignore this email — your password won't change.</p>
          <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:24px 0;">
          <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.25);">Sidelile High School · sidelile.edu.za</p>
        </div>
      </div>
    `,
  });
}

export async function sendApplicationConfirmationEmail(to: string, firstName: string, ref: string, grade: string) {
  await getResend().emails.send({
    from: FROM,
    to,
    subject: `Application received — ${ref}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;background:#0C0C0C;color:#fff;border-radius:16px;overflow:hidden;">
        <div style="background:#C9A84C;padding:24px 32px;">
          <h1 style="margin:0;font-size:22px;font-weight:800;color:#000;letter-spacing:-0.03em;">SIDELILE HIGH SCHOOL</h1>
          <p style="margin:4px 0 0;font-size:12px;color:rgba(0,0,0,0.6);letter-spacing:0.12em;text-transform:uppercase;">Application Received</p>
        </div>
        <div style="padding:32px;">
          <p style="font-size:15px;color:rgba(255,255,255,0.75);margin:0 0 16px;">Dear <strong style="color:#fff;">${firstName}</strong>,</p>
          <p style="font-size:15px;color:rgba(255,255,255,0.75);margin:0 0 20px;">Thank you for applying to Sidelile High School. We have received your application for <strong style="color:#fff;">${grade}</strong>.</p>
          <div style="background:#161616;border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:18px 20px;margin-bottom:24px;">
            <p style="margin:0 0 6px;font-size:11px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.08em;">Your Reference Number</p>
            <p style="margin:0;font-size:24px;font-weight:800;color:#C9A84C;letter-spacing:0.05em;">${ref}</p>
          </div>
          <p style="font-size:14px;color:rgba(255,255,255,0.6);margin:0 0 8px;">Our admissions team will review your application and contact you within <strong style="color:#fff;">5 working days</strong>.</p>
          <p style="font-size:14px;color:rgba(255,255,255,0.6);margin:0 0 28px;">Please keep your reference number safe — you'll need it for any follow-up queries.</p>
          <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:24px 0;">
          <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.25);">Sidelile High School · sidelile.edu.za</p>
        </div>
      </div>
    `,
  });
}

export async function sendAccountCreatedEmail(to: string, name: string, portalId: string, schoolEmail: string, tempPassword: string) {
  const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL}/student-portal`;

  await getResend().emails.send({
    from: FROM,
    to,
    subject: 'Your Sidelile student portal account is ready',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;background:#0C0C0C;color:#fff;border-radius:16px;overflow:hidden;">
        <div style="background:#C9A84C;padding:24px 32px;">
          <h1 style="margin:0;font-size:22px;font-weight:800;color:#000;letter-spacing:-0.03em;">SIDELILE HIGH SCHOOL</h1>
          <p style="margin:4px 0 0;font-size:12px;color:rgba(0,0,0,0.6);letter-spacing:0.12em;text-transform:uppercase;">Welcome to the Portal</p>
        </div>
        <div style="padding:32px;">
          <p style="font-size:15px;color:rgba(255,255,255,0.75);margin:0 0 16px;">Dear <strong style="color:#fff;">${name}</strong>,</p>
          <p style="font-size:15px;color:rgba(255,255,255,0.75);margin:0 0 24px;">Your application has been <strong style="color:#10B981;">approved</strong> and your student portal account has been created. Here are your login details:</p>
          <div style="background:#161616;border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:18px 20px;margin-bottom:24px;">
            <div style="margin-bottom:12px;">
              <p style="margin:0 0 4px;font-size:11px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.08em;">Portal ID</p>
              <p style="margin:0;font-size:18px;font-weight:700;color:#C9A84C;">${portalId}</p>
            </div>
            <div style="margin-bottom:12px;">
              <p style="margin:0 0 4px;font-size:11px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.08em;">School Email</p>
              <p style="margin:0;font-size:14px;color:#fff;">${schoolEmail}</p>
            </div>
            <div>
              <p style="margin:0 0 4px;font-size:11px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.08em;">Temporary Password</p>
              <p style="margin:0;font-size:18px;font-weight:700;color:#fff;letter-spacing:0.05em;">${tempPassword}</p>
            </div>
          </div>
          <p style="font-size:13px;color:rgba(255,255,255,0.5);margin:0 0 24px;">Please change your password after your first login for security.</p>
          <a href="${loginUrl}" style="display:inline-block;background:#C9A84C;color:#000;text-decoration:none;padding:13px 28px;border-radius:10px;font-weight:700;font-size:15px;">Login to Student Portal</a>
          <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:24px 0;">
          <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.25);">Sidelile High School · sidelile.edu.za</p>
        </div>
      </div>
    `,
  });
}
