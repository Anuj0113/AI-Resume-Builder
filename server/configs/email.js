import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendPasswordResetEmail = async (toEmail, resetUrl) => {
    await resend.emails.send({
        from: process.env.EMAIL_FROM,
        to: toEmail,
        subject: 'Reset your Resume Builder password',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #16a34a; font-size: 28px;">resume.</h1>
                </div>
                <h2 style="color: #1e293b;">Reset Your Password</h2>
                <p style="color: #475569;">You requested a password reset for your Resume Builder account.</p>
                <p style="color: #475569;">Click the button below to reset your password. This link expires in <strong>15 minutes</strong>.</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" 
                    style="display: inline-block; padding: 12px 32px; background-color: #16a34a; color: white; 
                    text-decoration: none; border-radius: 24px; font-size: 15px; font-weight: 500;">
                        Reset Password
                    </a>
                </div>
                <p style="color: #94a3b8; font-size: 13px;">If you didn't request this, you can safely ignore this email.</p>
                <p style="color: #94a3b8; font-size: 13px;">This link will expire in 15 minutes for security reasons.</p>
                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                <p style="color: #94a3b8; font-size: 12px; text-align: center;">© 2025 Resume Builder. All rights reserved.</p>
            </div>
        `
    })
}