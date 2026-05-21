import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params

  if (!orderId) {
    return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
  }

  const client = await clientPromise
  const db = client.db(process.env.MONGODB_DB)

  const order = await db.collection('orders').findOne({ orderId })

  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  return NextResponse.json({
    orderId: order.orderId,
    status: order.status,
    paymentMethod: order.paymentMethod,
    customer: {
      name: order.customer.name,
      city: order.customer.city,
    },
    items: order.items,
    subtotal: order.subtotal,
    deliveryCharge: order.deliveryCharge,
    prepaidDiscount: order.prepaidDiscount,
    total: order.total,
    createdAt: order.createdAt,
  })
}
