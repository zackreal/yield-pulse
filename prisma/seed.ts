import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create Workspace
  const workspace = await prisma.workspace.create({
    data: {
      name: 'Enterprise HQ',
      industry: 'Grocery',
      baseCurrency: 'IDR',
    },
  });

  const passwordHash = await bcrypt.hash('password123', 10);

  // Create Users
  const users = [
    {
      email: 'admin@enterprise.com',
      fullName: 'Super Admin',
      role: UserRole.SUPER_ADMIN,
      workspaceId: workspace.id,
      passwordHash,
    },
    {
      email: 'manager@enterprise.com',
      fullName: 'Store Manager',
      role: UserRole.STORE_MANAGER,
      workspaceId: workspace.id,
      passwordHash,
    },
    {
      email: 'analyst@enterprise.com',
      fullName: 'Data Analyst',
      role: UserRole.DATA_ANALYST,
      workspaceId: workspace.id,
      passwordHash,
    },
    {
      email: 'cashier@enterprise.com',
      fullName: 'POS Cashier',
      role: UserRole.POS_CASHIER,
      workspaceId: workspace.id,
      passwordHash,
    }
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }
  
  // Create Customers
  const customers = [
    { name: 'Budi Santoso', phone: '08123456789', points: 150 },
    { name: 'Siti Aminah', phone: '08987654321', points: 320 },
    { name: 'Rahmat Hidayat', phone: '08112233445', points: 45 },
    { name: 'Dinda Pratiwi', phone: '08556677889', points: 890 },
  ];

  for (const c of customers) {
    await prisma.customer.upsert({
      where: { phone: c.phone },
      update: {},
      create: {
        workspaceId: workspace.id,
        name: c.name,
        phone: c.phone,
        points: c.points,
      }
    });
  }

  // Create Products
  const products = [
    { sku: '8991234', name: 'Susu Segar 1 Liter', category: 'Minuman', cogs: 15000, basePrice: 20000, minPrice: 17000, baseDemand: 10 },
    { sku: '8992222', name: 'Roti Gandum Premium', category: 'Makanan', cogs: 12000, basePrice: 18500, minPrice: 14000, baseDemand: 5 },
    { sku: '8993333', name: 'Pisang Cavendish 1 Sisir', category: 'Segar', cogs: 18000, basePrice: 25000, minPrice: 20000, baseDemand: 8 },
    { sku: '8994444', name: 'Telur Ayam 1 Kg', category: 'Segar', cogs: 22000, basePrice: 28000, minPrice: 24000, baseDemand: 15 },
    { sku: '8995555', name: 'Beras Premium 5 Kg', category: 'Kebutuhan', cogs: 55000, basePrice: 65000, minPrice: 60000, baseDemand: 20 },
    { sku: '8996666', name: 'Minyak Goreng 2 Liter', category: 'Kebutuhan', cogs: 28000, basePrice: 34000, minPrice: 30000, baseDemand: 12 },
  ];

  for (const p of products) {
    const product = await prisma.product.upsert({
      where: { sku: p.sku },
      update: {},
      create: {
        workspaceId: workspace.id,
        sku: p.sku,
        name: p.name,
        category: p.category,
        cogs: p.cogs,
        basePrice: p.basePrice,
        minPrice: p.minPrice,
        baseDemand: p.baseDemand,
      }
    });

    // Create a batch if not exists
    const existingBatch = await prisma.batch.findFirst({ where: { productId: product.id } });
    if (!existingBatch) {
      await prisma.batch.create({
        data: {
          batchNumber: `BATCH-${p.sku}-${Date.now()}`,
          productId: product.id,
          quantity: 50,
          expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days from now
          currentPrice: p.basePrice,
          status: 'OPTIMAL'
        }
      });
    }
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
