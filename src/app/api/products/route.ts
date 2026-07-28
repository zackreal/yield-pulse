import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        batches: {
          where: {
            status: {
              notIn: ['EXPIRED', 'SOLD_OUT']
            }
          },
          orderBy: {
            expiryDate: 'asc'
          }
        }
      }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
