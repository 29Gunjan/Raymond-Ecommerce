const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Verify connection
transporter.verify((error, success) => {
    if (error) {
        console.log('SMTP connection error:', error.message);
    } else {
        console.log('SMTP server ready to send emails');
    }
});

// Send email helper
const sendEmail = async ({ to, subject, html }) => {
    try {
        const info = await transporter.sendMail({
            from: `"${process.env.FROM_NAME || 'Raymond Store'}" <${process.env.FROM_EMAIL}>`,
            to,
            subject,
            html
        });
        console.log('Email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Email send error:', error);
        return { success: false, error: error.message };
    }
};

// Email Templates
const emailTemplates = {
    // Order Confirmation Email
    orderConfirmation: (order, user) => {
        const itemsHtml = order.items.map(item => `
            <tr>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">
                    ${item.product?.name || 'Product'}
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">
                    ${item.variant?.size || '-'} / ${item.variant?.color || '-'}
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">
                    ${item.quantity}
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">
                    ₹${(item.price * item.quantity).toLocaleString('en-IN')}
                </td>
            </tr>
        `).join('');

        return {
            subject: `Order Confirmed - #${order.orderNumber}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #1a1a2e, #16213e); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
                        .header h1 { margin: 0; font-size: 28px; }
                        .content { background: #fff; padding: 30px; border: 1px solid #eee; }
                        .order-info { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
                        .order-number { font-size: 24px; color: #d4af37; font-weight: bold; }
                        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                        th { background: #f8f9fa; padding: 12px; text-align: left; border-bottom: 2px solid #ddd; }
                        .total-row { background: #f8f9fa; font-weight: bold; }
                        .footer { background: #1a1a2e; color: #aaa; padding: 20px; text-align: center; border-radius: 0 0 12px 12px; }
                        .btn { display: inline-block; background: #d4af37; color: #000; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Raymond</h1>
                            <p style="margin: 5px 0 0; opacity: 0.9;">The Complete Man</p>
                        </div>
                        <div class="content">
                            <h2 style="color: #1a1a2e;">Thank You for Your Order! 🎉</h2>
                            <p>Hi ${user.name || 'Valued Customer'},</p>
                            <p>Your order has been confirmed and is being processed. Here are your order details:</p>
                            
                            <div class="order-info">
                                <p style="margin: 0;">Order Number</p>
                                <p class="order-number">${order.orderNumber}</p>
                                <p style="margin: 0; color: #666;">Placed on ${new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            </div>

                            <h3>Order Items</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th style="text-align: center;">Variant</th>
                                        <th style="text-align: center;">Qty</th>
                                        <th style="text-align: right;">Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${itemsHtml}
                                    <tr class="total-row">
                                        <td colspan="3" style="padding: 12px; text-align: right;">Total</td>
                                        <td style="padding: 12px; text-align: right; font-size: 18px; color: #d4af37;">₹${order.total.toLocaleString('en-IN')}</td>
                                    </tr>
                                </tbody>
                            </table>

                            ${order.address ? `
                            <h3>Delivery Address</h3>
                            <p style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                                ${order.address.name}<br>
                                ${order.address.street}<br>
                                ${order.address.city}, ${order.address.state} - ${order.address.pincode}<br>
                                Phone: ${order.address.phone}
                            </p>
                            ` : ''}

                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${process.env.FRONTEND_URL}/orders/${order.id}" class="btn">View Order Details</a>
                            </div>
                        </div>
                        <div class="footer">
                            <p style="margin: 0;">Raymond Store</p>
                            <p style="margin: 5px 0 0; font-size: 12px;">Questions? Contact us at support@raymond.com</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };
    },

    // Password Reset Email
    passwordReset: (user, resetToken) => {
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

        return {
            subject: 'Reset Your Password - Raymond Store',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #1a1a2e, #16213e); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
                        .content { background: #fff; padding: 30px; border: 1px solid #eee; }
                        .footer { background: #1a1a2e; color: #aaa; padding: 20px; text-align: center; border-radius: 0 0 12px 12px; }
                        .btn { display: inline-block; background: #d4af37; color: #000; padding: 14px 40px; text-decoration: none; border-radius: 6px; font-weight: bold; }
                        .warning { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 8px; margin: 20px 0; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Raymond</h1>
                            <p style="margin: 5px 0 0; opacity: 0.9;">Password Reset Request</p>
                        </div>
                        <div class="content">
                            <h2>Reset Your Password</h2>
                            <p>Hi ${user.name || 'there'},</p>
                            <p>We received a request to reset your password. Click the button below to create a new password:</p>
                            
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${resetUrl}" class="btn">Reset Password</a>
                            </div>

                            <div class="warning">
                                <strong>⚠️ Important:</strong>
                                <ul style="margin: 10px 0 0; padding-left: 20px;">
                                    <li>This link expires in 1 hour</li>
                                    <li>If you didn't request this, please ignore this email</li>
                                </ul>
                            </div>

                            <p style="color: #666; font-size: 14px;">
                                If the button doesn't work, copy and paste this link into your browser:<br>
                                <a href="${resetUrl}" style="color: #d4af37; word-break: break-all;">${resetUrl}</a>
                            </p>
                        </div>
                        <div class="footer">
                            <p style="margin: 0;">Raymond Store</p>
                            <p style="margin: 5px 0 0; font-size: 12px;">This is an automated email. Please do not reply.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };
    },

    // Account Verification Email
    accountVerification: (user, verificationToken) => {
        const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

        return {
            subject: 'Verify Your Email - Raymond Store',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #1a1a2e, #16213e); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
                        .content { background: #fff; padding: 30px; border: 1px solid #eee; }
                        .footer { background: #1a1a2e; color: #aaa; padding: 20px; text-align: center; border-radius: 0 0 12px 12px; }
                        .btn { display: inline-block; background: #d4af37; color: #000; padding: 14px 40px; text-decoration: none; border-radius: 6px; font-weight: bold; }
                        .features { display: flex; justify-content: space-around; margin: 25px 0; text-align: center; }
                        .feature { padding: 10px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Raymond</h1>
                            <p style="margin: 5px 0 0; opacity: 0.9;">Welcome to the Family!</p>
                        </div>
                        <div class="content">
                            <h2>Welcome, ${user.name || 'Valued Customer'}! 🎉</h2>
                            <p>Thank you for creating an account with Raymond Store. Please verify your email address to complete your registration.</p>
                            
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${verifyUrl}" class="btn">Verify Email Address</a>
                            </div>

                            <h3>What's Next?</h3>
                            <table style="width: 100%;">
                                <tr>
                                    <td style="padding: 10px; text-align: center;">
                                        <div style="font-size: 30px;">🛍️</div>
                                        <p style="margin: 5px 0; font-weight: bold;">Shop Premium</p>
                                        <p style="margin: 0; font-size: 14px; color: #666;">Browse our collection</p>
                                    </td>
                                    <td style="padding: 10px; text-align: center;">
                                        <div style="font-size: 30px;">🚚</div>
                                        <p style="margin: 5px 0; font-weight: bold;">Free Shipping</p>
                                        <p style="margin: 0; font-size: 14px; color: #666;">On orders above ₹999</p>
                                    </td>
                                    <td style="padding: 10px; text-align: center;">
                                        <div style="font-size: 30px;">🎁</div>
                                        <p style="margin: 5px 0; font-weight: bold;">Member Rewards</p>
                                        <p style="margin: 0; font-size: 14px; color: #666;">Earn points on purchases</p>
                                    </td>
                                </tr>
                            </table>

                            <p style="color: #666; font-size: 14px; margin-top: 20px;">
                                If the button doesn't work, copy and paste this link:<br>
                                <a href="${verifyUrl}" style="color: #d4af37; word-break: break-all;">${verifyUrl}</a>
                            </p>
                        </div>
                        <div class="footer">
                            <p style="margin: 0;">Raymond Store</p>
                            <p style="margin: 5px 0 0; font-size: 12px;">The Complete Man</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };
    },

    // Order Status Update Email
    orderStatusUpdate: (order, user, newStatus) => {
        const statusMessages = {
            'CONFIRMED': 'Your order has been confirmed! 🎉',
            'PROCESSING': 'Your order is being processed 📦',
            'SHIPPED': 'Your order has been shipped! 🚚',
            'DELIVERED': 'Your order has been delivered! ✅',
            'CANCELLED': 'Your order has been cancelled ❌'
        };

        return {
            subject: `Order Update - #${order.orderNumber} ${newStatus}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #1a1a2e, #16213e); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
                        .content { background: #fff; padding: 30px; border: 1px solid #eee; }
                        .footer { background: #1a1a2e; color: #aaa; padding: 20px; text-align: center; border-radius: 0 0 12px 12px; }
                        .status-box { background: ${newStatus === 'CANCELLED' ? '#fee2e2' : '#d1fae5'}; border: 1px solid ${newStatus === 'CANCELLED' ? '#ef4444' : '#10b981'}; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
                        .btn { display: inline-block; background: #d4af37; color: #000; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Raymond</h1>
                            <p style="margin: 5px 0 0; opacity: 0.9;">Order Update</p>
                        </div>
                        <div class="content">
                            <h2>Order Status Update</h2>
                            <p>Hi ${user.name || 'Valued Customer'},</p>
                            
                            <div class="status-box">
                                <p style="font-size: 18px; margin: 0; font-weight: bold; color: ${newStatus === 'CANCELLED' ? '#ef4444' : '#10b981'};">
                                    ${statusMessages[newStatus] || `Status: ${newStatus}`}
                                </p>
                            </div>

                            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
                            <p><strong>New Status:</strong> ${newStatus}</p>
                            <p><strong>Order Total:</strong> ₹${order.total.toLocaleString('en-IN')}</p>

                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${process.env.FRONTEND_URL}/orders/${order.id}" class="btn">View Order Details</a>
                            </div>
                        </div>
                        <div class="footer">
                            <p style="margin: 0;">Raymond Store</p>
                            <p style="margin: 5px 0 0; font-size: 12px;">Questions? Contact us at support@raymond.com</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };
    },

    // Cancel OTP Email
    cancelOtp: (order, user, otp) => {
        return {
            subject: `OTP for Order Cancellation - #${order.orderNumber}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #1a1a2e, #16213e); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
                        .content { background: #fff; padding: 30px; border: 1px solid #eee; }
                        .footer { background: #1a1a2e; color: #aaa; padding: 20px; text-align: center; border-radius: 0 0 12px 12px; }
                        .otp-box { background: #f8f9fa; padding: 25px; border-radius: 8px; text-align: center; margin: 25px 0; border: 2px dashed #d4af37; }
                        .otp-code { font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #1a1a2e; margin: 0; }
                        .warning { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 8px; margin: 20px 0; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Raymond</h1>
                            <p style="margin: 5px 0 0; opacity: 0.9;">Order Cancellation Verification</p>
                        </div>
                        <div class="content">
                            <h2>🔐 Verify Your Cancellation Request</h2>
                            <p>Hi ${user.name || 'Valued Customer'},</p>
                            <p>You have requested to cancel your order <strong>#${order.orderNumber}</strong>. Please use the OTP below to confirm your cancellation:</p>
                            
                            <div class="otp-box">
                                <p style="margin: 0 0 10px; color: #666;">Your OTP Code</p>
                                <p class="otp-code">${otp}</p>
                            </div>

                            <div class="warning">
                                <strong>⚠️ Important:</strong>
                                <ul style="margin: 10px 0 0; padding-left: 20px;">
                                    <li>This OTP is valid for <strong>10 minutes</strong></li>
                                    <li>Do not share this OTP with anyone</li>
                                    <li>If you didn't request this, please ignore this email</li>
                                </ul>
                            </div>

                            <p style="color: #666; font-size: 14px;">
                                If you did not request this cancellation, your order will remain active and no action is required.
                            </p>
                        </div>
                        <div class="footer">
                            <p style="margin: 0;">Raymond Store</p>
                            <p style="margin: 5px 0 0; font-size: 12px;">This is an automated email. Please do not reply.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };
    },

    // Order Cancelled Confirmation Email
    orderCancelled: (order, user, reason) => {
        return {
            subject: `Order Cancelled - #${order.orderNumber}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #1a1a2e, #16213e); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
                        .content { background: #fff; padding: 30px; border: 1px solid #eee; }
                        .footer { background: #1a1a2e; color: #aaa; padding: 20px; text-align: center; border-radius: 0 0 12px 12px; }
                        .cancelled-box { background: #fee2e2; border: 1px solid #ef4444; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
                        .reason-box { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0; }
                        .btn { display: inline-block; background: #d4af37; color: #000; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Raymond</h1>
                            <p style="margin: 5px 0 0; opacity: 0.9;">Order Cancellation Confirmed</p>
                        </div>
                        <div class="content">
                            <h2>Order Cancelled Successfully</h2>
                            <p>Hi ${user.name || 'Valued Customer'},</p>
                            
                            <div class="cancelled-box">
                                <p style="font-size: 18px; margin: 0; font-weight: bold; color: #ef4444;">
                                    ❌ Order #${order.orderNumber} has been cancelled
                                </p>
                            </div>

                            <div class="reason-box">
                                <p style="margin: 0; font-weight: bold;">Reason for Cancellation:</p>
                                <p style="margin: 5px 0 0;">${reason}</p>
                            </div>

                            <p><strong>Order Total:</strong> ₹${order.total.toLocaleString('en-IN')}</p>
                            
                            ${order.paymentStatus === 'PAID' ? `
                            <p style="color: #16a34a; font-weight: bold;">
                                💰 Refund will be processed within 5-7 business days to your original payment method.
                            </p>
                            ` : ''}

                            <p style="margin-top: 25px;">We're sorry to see this order cancelled. If you have any questions or concerns, please don't hesitate to reach out to our customer support.</p>

                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${process.env.FRONTEND_URL}/products" class="btn">Continue Shopping</a>
                            </div>
                        </div>
                        <div class="footer">
                            <p style="margin: 0;">Raymond Store</p>
                            <p style="margin: 5px 0 0; font-size: 12px;">Questions? Contact us at support@raymond.com</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };
    },
    // Return Request Confirmation Email
    returnRequested: (returnRequest, user) => {
        const itemsList = returnRequest.items.map(item => `
            <tr>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">
                    ${item.orderItem.product.name} (${item.orderItem.variant.size} / ${item.orderItem.variant.color})
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">
                    ${item.quantity}
                </td>
            </tr>
        `).join('');

        return {
            subject: `Return Request ${returnRequest.returnNumber} — Raymond Store`,
            html: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff;">
                    <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 30px; text-align: center;">
                        <h1 style="color: #e8d5b7; margin: 0; font-size: 28px; letter-spacing: 2px;">RAYMOND</h1>
                        <p style="color: #ccc; margin: 5px 0 0; font-size: 12px; letter-spacing: 3px;">RETURN REQUEST RECEIVED</p>
                    </div>
                    <div style="padding: 30px;">
                        <p style="color: #333;">Dear ${user.name},</p>
                        <p style="color: #555;">We have received your return request. Here are the details:</p>
                        
                        <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
                            <p style="margin: 5px 0;"><strong>Return Number:</strong> ${returnRequest.returnNumber}</p>
                            <p style="margin: 5px 0;"><strong>Order:</strong> ${returnRequest.order.orderNumber}</p>
                            <p style="margin: 5px 0;"><strong>Reason:</strong> ${returnRequest.reason}</p>
                            <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #f0ad4e;">Requested</span></p>
                            <p style="margin: 5px 0;"><strong>Refund Amount:</strong> ₹${returnRequest.refundAmount.toLocaleString('en-IN')}</p>
                        </div>

                        <h3 style="color: #1a1a2e; border-bottom: 2px solid #e8d5b7; padding-bottom: 8px;">Items to Return</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr style="background: #f8f9fa;">
                                    <th style="padding: 12px; text-align: left;">Product</th>
                                    <th style="padding: 12px; text-align: center;">Qty</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${itemsList}
                            </tbody>
                        </table>

                        <p style="color: #555; margin-top: 20px;">Our team will review your request within 2-3 business days. You will receive an email once the request is processed.</p>
                    </div>
                    <div style="background: #1a1a2e; padding: 20px; text-align: center;">
                        <p style="color: #888; margin: 0; font-size: 12px;">© ${new Date().getFullYear()} Raymond Store. All rights reserved.</p>
                    </div>
                </div>
            `
        };
    },

    // Return Status Update Email
    returnStatusUpdate: (returnRequest, user, newStatus) => {
        const statusMessages = {
            'APPROVED': {
                color: '#28a745',
                label: 'Approved',
                message: 'Your return request has been approved. Please pack the items securely and our pickup agent will contact you soon.'
            },
            'REJECTED': {
                color: '#dc3545',
                label: 'Rejected',
                message: `Your return request has been rejected.${returnRequest.adminNotes ? ' Reason: ' + returnRequest.adminNotes : ''}`
            },
            'PICKED_UP': {
                color: '#17a2b8',
                label: 'Picked Up',
                message: 'Your return items have been picked up. We will inspect them and process your refund.'
            },
            'RECEIVED': {
                color: '#6f42c1',
                label: 'Received',
                message: 'We have received your returned items and are inspecting them. Refund will be processed shortly.'
            },
            'REFUNDED': {
                color: '#28a745',
                label: 'Refunded',
                message: `Your refund of ₹${returnRequest.refundAmount.toLocaleString('en-IN')} has been processed. It will reflect in your account within 5-7 business days.`
            }
        };

        const statusInfo = statusMessages[newStatus] || { color: '#555', label: newStatus, message: '' };

        return {
            subject: `Return ${returnRequest.returnNumber} — ${statusInfo.label} — Raymond Store`,
            html: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff;">
                    <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 30px; text-align: center;">
                        <h1 style="color: #e8d5b7; margin: 0; font-size: 28px; letter-spacing: 2px;">RAYMOND</h1>
                        <p style="color: #ccc; margin: 5px 0 0; font-size: 12px; letter-spacing: 3px;">RETURN UPDATE</p>
                    </div>
                    <div style="padding: 30px;">
                        <p style="color: #333;">Dear ${user.name},</p>
                        
                        <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
                            <p style="margin: 0 0 10px; color: #888; font-size: 14px;">Return ${returnRequest.returnNumber}</p>
                            <h2 style="margin: 0; color: ${statusInfo.color}; font-size: 24px;">${statusInfo.label}</h2>
                        </div>

                        <p style="color: #555; line-height: 1.6;">${statusInfo.message}</p>

                        ${returnRequest.adminNotes && newStatus !== 'REJECTED' ? `
                            <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 12px 16px; margin: 20px 0; border-radius: 0 4px 4px 0;">
                                <strong>Note from our team:</strong> ${returnRequest.adminNotes}
                            </div>
                        ` : ''}

                        <div style="background: #f8f9fa; border-radius: 8px; padding: 16px; margin: 20px 0;">
                            <p style="margin: 5px 0;"><strong>Order:</strong> ${returnRequest.order.orderNumber}</p>
                            <p style="margin: 5px 0;"><strong>Refund Amount:</strong> ₹${returnRequest.refundAmount.toLocaleString('en-IN')}</p>
                        </div>

                        <p style="color: #888; font-size: 13px;">If you have any questions, please contact our support team.</p>
                    </div>
                    <div style="background: #1a1a2e; padding: 20px; text-align: center;">
                        <p style="color: #888; margin: 0; font-size: 12px;">© ${new Date().getFullYear()} Raymond Store. All rights reserved.</p>
                    </div>
                </div>
            `
        };
    }
};

module.exports = {
    sendEmail,
    emailTemplates,
    transporter
};
