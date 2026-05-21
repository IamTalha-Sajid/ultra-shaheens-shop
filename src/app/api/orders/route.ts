import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { generateOrderId } from '@/lib/generateOrderId'
import { sendEmail } from '@/lib/email'

type OrderItem = {
  productId: string
  productName: string
  size: string
  quantity: number
  unitPrice: number
  lineTotal: number
}

type OrderPayload = {
  paymentMethod: 'cod' | 'prepaid'
  customer: {
    name: string
    email: string
    phone: string
    address: string
    city: string
  }
  items: OrderItem[]
  subtotal: number
  deliveryCharge: number
  prepaidDiscount: number
  total: number
}

function formatPKR(amount: number) {
  return `Rs. ${amount.toLocaleString('en-PK')}`
}

function buildInvoiceHtml(orderId: string, status: string, body: OrderPayload) {
  const { customer, items, paymentMethod, subtotal, deliveryCharge, prepaidDiscount, total } = body

  const statusMeta: Record<string, { color: string; bg: string; border: string; label: string }> = {
    pending:    { color: '#f59e0b', bg: '#f59e0b18', border: '#f59e0b44', label: 'Payment Pending' },
    processing: { color: '#6366f1', bg: '#6366f118', border: '#6366f144', label: 'Processing' },
    dispatched: { color: '#22c55e', bg: '#22c55e18', border: '#22c55e44', label: 'Dispatched' },
    cancelled:  { color: '#ef4444', bg: '#ef444418', border: '#ef444444', label: 'Cancelled' },
  }
  const sm = statusMeta[status] ?? statusMeta.pending

  const itemRows = items.map((item) => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #1a2535;font-size:14px;color:#d1d5db;">${item.productName}</td>
      <td style="padding:10px 0;border-bottom:1px solid #1a2535;font-size:13px;color:#9ca3af;text-align:center;">${item.size}</td>
      <td style="padding:10px 0;border-bottom:1px solid #1a2535;font-size:13px;color:#9ca3af;text-align:center;">×${item.quantity}</td>
      <td style="padding:10px 0;border-bottom:1px solid #1a2535;font-size:14px;color:#f3f754;text-align:right;font-weight:700;">${formatPKR(item.lineTotal)}</td>
    </tr>
  `).join('')

  const prepaidNote = paymentMethod === 'prepaid' ? `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      <tr><td style="background:#1c1408;border:1px solid #78350f;border-radius:12px;padding:20px;">
        <p style="margin:0 0 14px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#f59e0b;">Action Required — Complete Your Payment</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="font-size:13px;color:#9ca3af;padding-bottom:6px;">Bank</td><td style="font-size:13px;color:#fff;font-weight:600;text-align:right;padding-bottom:6px;">NayaPay</td></tr>
          <tr><td style="font-size:13px;color:#9ca3af;padding-bottom:6px;">Account Name</td><td style="font-size:13px;color:#fff;font-weight:600;text-align:right;padding-bottom:6px;">Usama Mushtaq Bhutta</td></tr>
          <tr><td style="font-size:13px;color:#9ca3af;padding-bottom:6px;">Account No</td><td style="font-size:13px;color:#fff;font-weight:600;font-family:monospace;text-align:right;padding-bottom:6px;">03359169165</td></tr>
          <tr><td style="font-size:13px;color:#9ca3af;padding-bottom:10px;">IBAN</td><td style="font-size:12px;color:#fff;font-weight:600;font-family:monospace;text-align:right;padding-bottom:10px;">PK16NAYA1234503359169165</td></tr>
          <tr><td style="font-size:14px;color:#f59e0b;font-weight:700;border-top:1px solid #78350f;padding-top:10px;">Amount to Pay</td><td style="font-size:16px;color:#f59e0b;font-weight:900;text-align:right;border-top:1px solid #78350f;padding-top:10px;">${formatPKR(total)}</td></tr>
        </table>
        <p style="margin:14px 0 0;padding:10px 12px;background:#3b0a0a;border:1px solid #7f1d1d;border-radius:8px;font-size:12px;color:#fca5a5;">&#9888; Payment must be received within <strong style="color:#fff;">6 hours</strong> or your order will be cancelled automatically.</p>
      </td></tr>
    </table>
  ` : ''

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Order ${orderId} — Ultra Shaheens</title>
</head>
<body style="margin:0;padding:0;background-color:#030b14;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#030b14;padding:40px 0;">
<tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;">

  <!-- Header -->
  <tr><td align="center" style="padding-bottom:32px;">
    <table cellpadding="0" cellspacing="0">
      <tr><td style="background:#0b1f13;border:1px solid #1f2937;border-radius:16px;padding:18px 32px;text-align:center;">
        <p style="margin:0;font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#6b7280;">ULTRA SHAHEENS OFFICIAL SHOP</p>
        <p style="margin:8px 0 0;font-size:26px;font-weight:900;letter-spacing:4px;text-transform:uppercase;color:#f3f754;">Order Confirmed</p>
      </td></tr>
    </table>
  </td></tr>

  <!-- Order ID + Status (table layout — no flexbox) -->
  <tr><td style="background:#0d1a26;border:1px solid #1e2e3d;border-radius:16px;padding:20px 24px;margin-bottom:20px;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="vertical-align:middle;">
          <p style="margin:0;font-size:10px;color:#6b7280;text-transform:uppercase;letter-spacing:1.5px;">Order ID</p>
          <p style="margin:6px 0 0;font-size:20px;font-weight:900;color:#ffffff;font-family:monospace,monospace;">${orderId}</p>
        </td>
        <td style="vertical-align:middle;text-align:right;">
          <span style="display:inline-block;background:${sm.bg};color:${sm.color};border:1px solid ${sm.border};border-radius:999px;padding:5px 14px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">${sm.label}</span>
        </td>
      </tr>
    </table>
  </td></tr>
  <tr><td style="height:16px;"></td></tr>

  <!-- Customer -->
  <tr><td style="background:#0d1a26;border:1px solid #1e2e3d;border-radius:16px;padding:20px 24px;">
    <p style="margin:0 0 14px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#6b7280;">Delivery To</p>
    <p style="margin:0 0 4px;font-size:16px;font-weight:700;color:#ffffff;">${customer.name}</p>
    <p style="margin:0 0 4px;font-size:13px;color:#9ca3af;">${customer.phone}</p>
    <p style="margin:0 0 4px;font-size:13px;color:#9ca3af;">${customer.address}</p>
    <p style="margin:0;font-size:13px;color:#9ca3af;">${customer.city}</p>
  </td></tr>
  <tr><td style="height:16px;"></td></tr>

  <!-- Items -->
  <tr><td style="background:#0d1a26;border:1px solid #1e2e3d;border-radius:16px;padding:20px 24px;">
    <p style="margin:0 0 14px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#6b7280;">Items Ordered</p>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <th style="text-align:left;font-size:11px;color:#4b5563;padding-bottom:10px;font-weight:600;border-bottom:1px solid #1e2e3d;">Product</th>
        <th style="text-align:center;font-size:11px;color:#4b5563;padding-bottom:10px;font-weight:600;border-bottom:1px solid #1e2e3d;">Size</th>
        <th style="text-align:center;font-size:11px;color:#4b5563;padding-bottom:10px;font-weight:600;border-bottom:1px solid #1e2e3d;">Qty</th>
        <th style="text-align:right;font-size:11px;color:#4b5563;padding-bottom:10px;font-weight:600;border-bottom:1px solid #1e2e3d;">Price</th>
      </tr>
      ${itemRows}
    </table>
  </td></tr>
  <tr><td style="height:16px;"></td></tr>

  <!-- Pricing -->
  <tr><td style="background:#0d1a26;border:1px solid #1e2e3d;border-radius:16px;padding:20px 24px;">
    <p style="margin:0 0 14px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#6b7280;">Pricing Summary</p>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="font-size:13px;color:#9ca3af;padding-bottom:8px;">Subtotal</td>
        <td style="font-size:13px;color:#fff;font-weight:600;text-align:right;padding-bottom:8px;">${formatPKR(subtotal)}</td>
      </tr>
      ${prepaidDiscount > 0 ? `<tr><td style="font-size:13px;color:#22c55e;padding-bottom:8px;">Prepaid discount (5%)</td><td style="font-size:13px;color:#22c55e;font-weight:600;text-align:right;padding-bottom:8px;">− ${formatPKR(prepaidDiscount)}</td></tr>` : ''}
      <tr>
        <td style="font-size:13px;color:#9ca3af;padding-bottom:14px;">Delivery</td>
        <td style="font-size:13px;color:#fff;font-weight:600;text-align:right;padding-bottom:14px;">${formatPKR(deliveryCharge)}</td>
      </tr>
      <tr>
        <td style="font-size:17px;color:#fff;font-weight:900;text-transform:uppercase;letter-spacing:1px;border-top:1px solid #1e2e3d;padding-top:14px;">Total</td>
        <td style="font-size:20px;color:#f3f754;font-weight:900;text-align:right;border-top:1px solid #1e2e3d;padding-top:14px;">${formatPKR(total)}</td>
      </tr>
      <tr>
        <td colspan="2" style="font-size:12px;color:#6b7280;padding-top:8px;">Payment method: <strong style="color:#9ca3af;">${paymentMethod === 'cod' ? 'Cash on Delivery' : 'Prepaid — Bank Transfer'}</strong></td>
      </tr>
    </table>
  </td></tr>
  <tr><td style="height:20px;"></td></tr>

  <!-- Prepaid payment instructions -->
  ${prepaidNote}

  <!-- Order Status Guide -->
  <tr><td style="background:#0d1a26;border:1px solid #1e2e3d;border-radius:16px;padding:20px 24px;">
    <p style="margin:0 0 16px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#6b7280;">Understanding Your Order Status</p>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding-bottom:14px;vertical-align:top;">
          <table cellpadding="0" cellspacing="0"><tr><td style="background:#f59e0b18;border:1px solid #f59e0b44;border-radius:6px;padding:3px 10px;font-size:11px;font-weight:700;color:#f59e0b;text-transform:uppercase;letter-spacing:0.5px;white-space:nowrap;">Payment Pending</td></tr></table>
        </td>
        <td style="padding-bottom:14px;padding-left:12px;vertical-align:top;font-size:13px;color:#9ca3af;line-height:1.5;">Order received. Awaiting payment transfer confirmation from you.</td>
      </tr>
      <tr>
        <td style="padding-bottom:14px;vertical-align:top;">
          <table cellpadding="0" cellspacing="0"><tr><td style="background:#6366f118;border:1px solid #6366f144;border-radius:6px;padding:3px 10px;font-size:11px;font-weight:700;color:#818cf8;text-transform:uppercase;letter-spacing:0.5px;white-space:nowrap;">Processing</td></tr></table>
        </td>
        <td style="padding-bottom:14px;padding-left:12px;vertical-align:top;font-size:13px;color:#9ca3af;line-height:1.5;">Payment confirmed. Your order is being packed and prepared for dispatch.</td>
      </tr>
      <tr>
        <td style="padding-bottom:14px;vertical-align:top;">
          <table cellpadding="0" cellspacing="0"><tr><td style="background:#22c55e18;border:1px solid #22c55e44;border-radius:6px;padding:3px 10px;font-size:11px;font-weight:700;color:#22c55e;text-transform:uppercase;letter-spacing:0.5px;white-space:nowrap;">Dispatched</td></tr></table>
        </td>
        <td style="padding-bottom:14px;padding-left:12px;vertical-align:top;font-size:13px;color:#9ca3af;line-height:1.5;">Your order is on its way! Expect delivery within 3–5 business days.</td>
      </tr>
      <tr>
        <td style="vertical-align:top;">
          <table cellpadding="0" cellspacing="0"><tr><td style="background:#ef444418;border:1px solid #ef444444;border-radius:6px;padding:3px 10px;font-size:11px;font-weight:700;color:#ef4444;text-transform:uppercase;letter-spacing:0.5px;white-space:nowrap;">Cancelled</td></tr></table>
        </td>
        <td style="padding-left:12px;vertical-align:top;font-size:13px;color:#9ca3af;line-height:1.5;">Order was cancelled. This may happen if prepaid payment was not received within 6 hours.</td>
      </tr>
    </table>
  </td></tr>
  <tr><td style="height:20px;"></td></tr>

  <!-- Track order CTA -->
  <tr><td style="background:#0d1a26;border:1px solid #1e2e3d;border-radius:16px;padding:24px;text-align:center;">
    <p style="margin:0 0 6px;font-size:13px;color:#9ca3af;">Track your order anytime using your Order ID</p>
    <p style="margin:0 0 16px;font-size:20px;font-weight:900;color:#ffffff;font-family:monospace,monospace;">${orderId}</p>
    <a href="https://shop.ultrashaheens.com/order-status?id=${orderId}" style="display:inline-block;background:#f3f754;color:#030b14;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;padding:12px 28px;border-radius:10px;text-decoration:none;">Track My Order</a>
  </td></tr>
  <tr><td style="height:32px;"></td></tr>

  <!-- Footer -->
  <tr><td style="text-align:center;padding-bottom:40px;">
    <p style="margin:0 0 4px;font-size:12px;color:#374151;font-weight:600;">Ultra Shaheens Official Shop</p>
    <p style="margin:0;font-size:11px;color:#1f2937;">shop.ultrashaheens.com</p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`
}

export async function POST(request: NextRequest) {
  try {
    const body: OrderPayload = await request.json()

    const { paymentMethod, customer, items, subtotal, deliveryCharge, prepaidDiscount, total } = body

    if (!paymentMethod || !['cod', 'prepaid'].includes(paymentMethod)) {
      return NextResponse.json({ error: 'Invalid payment method' }, { status: 400 })
    }

    if (!customer?.name || !customer?.email || !customer?.phone || !customer?.address || !customer?.city) {
      return NextResponse.json({ error: 'All customer fields are required' }, { status: 400 })
    }

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Order must contain at least one item' }, { status: 400 })
    }

    if (subtotal == null || deliveryCharge == null || prepaidDiscount == null || total == null) {
      return NextResponse.json({ error: 'Order totals are required' }, { status: 400 })
    }

    const orderId = generateOrderId()
    const status = paymentMethod === 'cod' ? 'processing' : 'pending'

    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)

    await db.collection('orders').insertOne({
      orderId,
      status,
      paymentMethod,
      customer,
      items,
      subtotal,
      deliveryCharge,
      prepaidDiscount,
      total,
      createdAt: new Date(),
    })

    // Send invoice email (non-blocking — don't fail the order if email fails)
    sendEmail({
      to: customer.email,
      subject: `Your Ultra Shaheens order ${orderId} is confirmed!`,
      html: buildInvoiceHtml(orderId, status, body),
    }).catch((err) => console.error('Invoice email failed:', err))

    return NextResponse.json({ orderId, status }, { status: 201 })
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
