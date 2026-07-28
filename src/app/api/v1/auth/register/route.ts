import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, fullName, companyName, industry, currency, role } = body;

    // Minimal validation
    if (!email || !password || !fullName || !companyName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create Workspace and User in a transaction
    const user = await prisma.$transaction(async (tx) => {
      const workspace = await tx.workspace.create({
        data: {
          name: companyName,
          industry: industry || 'Grocery',
          baseCurrency: currency || 'IDR',
        },
      });

      return tx.user.create({
        data: {
          email,
          passwordHash,
          fullName,
          role: role?.toUpperCase().replace(' ', '_') || 'STORE_MANAGER',
          workspaceId: workspace.id,
        },
      });
    });

    return NextResponse.json({ 
      success: true, 
      user: { id: user.id, email: user.email, role: user.role } 
    }, { status: 201 });

  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
