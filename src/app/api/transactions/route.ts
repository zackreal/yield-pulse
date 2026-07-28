import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cart, customerId, paymentMethod, amountReceived } = body;

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const invoiceNumber = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Calculate totals on server side for security
    let subtotal = 0;
    let totalDiscount = 0;

    const transactionItems = [];

    // Verifikasi harga dari DB
    for (const item of cart) {
      const product = await prisma.product.findUnique({
        where: { sku: item.sku.replace('YP-', '') }
      });

      if (!product) {
        return NextResponse.json({ error: `Product not found: ${item.sku}` }, { status: 404 });
      }

      // Check if item has algorithmic discount applied (starts with YP-)
      const isYieldPulseActive = item.sku.startsWith('YP-');
      
      const originalPrice = Number(product.basePrice);
      // For now, simple mock calculation for discount (e.g., 30% off)
      const discountPrice = isYieldPulseActive ? originalPrice * 0.7 : null;

      const itemTotal = originalPrice * item.qty;
      const itemDiscount = discountPrice ? (originalPrice - discountPrice) * item.qty : 0;

      subtotal += itemTotal;
      totalDiscount += itemDiscount;

      transactionItems.push({
        productId: product.id,
        quantity: item.qty,
        originalPrice,
        discountPrice,
        isYieldPulseActive
      });
    }

    const finalTotal = subtotal - totalDiscount;
    const changeAmount = paymentMethod === 'cash' ? Math.max(0, amountReceived - finalTotal) : 0;

    // Use a Prisma transaction to ensure atomicity
    const transaction = await prisma.$transaction(async (tx) => {
      // 1. Create Transaction
      const newTx = await tx.transaction.create({
        data: {
          invoiceNumber,
          customerId: customerId || null,
          paymentMethod,
          subtotal,
          discountTotal: totalDiscount,
          finalTotal,
          amountReceived: paymentMethod === 'cash' ? amountReceived : null,
          changeAmount,
          items: {
            create: transactionItems
          }
        },
        include: {
          items: true,
          customer: true
        }
      });

      // 2. Reduce stock from Batches
      for (const item of transactionItems) {
        // Find optimal batch (oldest expiry first)
        const batches = await tx.batch.findMany({
          where: {
            productId: item.productId,
            quantity: { gt: 0 },
            status: { notIn: ['EXPIRED', 'SOLD_OUT'] }
          },
          orderBy: {
            expiryDate: 'asc'
          }
        });

        let remainingQtyToDeduct = item.quantity;
        for (const batch of batches) {
          if (remainingQtyToDeduct <= 0) break;

          const qtyToDeduct = Math.min(batch.quantity, remainingQtyToDeduct);
          remainingQtyToDeduct -= qtyToDeduct;

          const newQty = batch.quantity - qtyToDeduct;
          await tx.batch.update({
            where: { id: batch.id },
            data: { 
              quantity: newQty,
              status: newQty === 0 ? 'SOLD_OUT' : batch.status
            }
          });
        }
      }

      // 3. Create SalesLogs
      for (const item of transactionItems) {
        await tx.salesLog.create({
          data: {
            productId: item.productId,
            quantitySold: item.quantity,
            priceAtSale: item.discountPrice || item.originalPrice
          }
        });
      }

      // 4. Update Customer Points (Optional logic: Rp100,000 = 10 pts)
      if (customerId) {
        const pointsEarned = Math.floor(finalTotal / 10000); // 1 point per 10k
        await tx.customer.update({
          where: { id: customerId },
          data: {
            points: { increment: pointsEarned }
          }
        });
      }

      return newTx;
    });

    return NextResponse.json(transaction);

  } catch (error) {
    console.error('Transaction Error:', error);
    return NextResponse.json({ error: 'Failed to process transaction' }, { status: 500 });
  }
}
