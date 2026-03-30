import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const categoriesData = [
  {
    nameAr: "بشوت ملكية",
    slug: "royal-bisht",
    description: "تصاميم رسمية فاخرة للمناسبات الكبيرة والزيارات الرسمية.",
    imageUrl:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
  },
  {
    nameAr: "بشوت يومية",
    slug: "daily-bisht",
    description: "بشوت عملية بخامات خفيفة للاستخدام اليومي والمجالس.",
    imageUrl:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80",
  },
  {
    nameAr: "بشوت فاخرة",
    slug: "luxury-bisht",
    description: "تشكيلة فاخرة بخيوط مطرزة يدويًا وتفاصيل دقيقة.",
    imageUrl:
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=1200&q=80",
  },
];

const productsData = [
  {
    nameAr: "بشت ملكي أسود بخيوط ذهبية",
    slug: "royal-black-gold",
    description: "بشت فاخر بخياطة دقيقة وخيوط ذهبية ناعمة لإطلالة رسمية.",
    fabric: "صوف إيطالي فاخر",
    color: "أسود",
    price: 2200,
    stock: 15,
    mainImage:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80",
    ],
    categorySlug: "royal-bisht",
  },
  {
    nameAr: "بشت أبيض للأعياد",
    slug: "white-eid-bisht",
    description: "قطعة أنيقة بخامة خفيفة للمناسبات الصباحية والأعياد.",
    fabric: "مزيج قطني فاخر",
    color: "أبيض",
    price: 1400,
    stock: 20,
    mainImage:
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1527719327859-c6ce80353573?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1200&q=80",
    ],
    categorySlug: "daily-bisht",
  },
  {
    nameAr: "بشت عنابي فاخر",
    slug: "maroon-signature-bisht",
    description: "بشت عصري بلون عنابي وتفاصيل تطريز مميزة.",
    fabric: "صوف كشمير",
    color: "عنابي",
    price: 1850,
    stock: 12,
    mainImage:
      "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
    ],
    categorySlug: "luxury-bisht",
  },
  {
    nameAr: "بشت كحلي للمناسبات",
    slug: "navy-occasion-bisht",
    description: "تصميم كحلي أنيق يناسب المناسبات الرسمية واجتماعات العمل.",
    fabric: "صوف خفيف",
    color: "كحلي",
    price: 1600,
    stock: 18,
    mainImage:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1200&q=80",
    ],
    categorySlug: "daily-bisht",
  },
  {
    nameAr: "بشت ذهبي مطرز",
    slug: "golden-premium-bisht",
    description: "قطعة فنية فاخرة بتطريز عريض للمناسبات الكبيرة.",
    fabric: "صوف كشمير مع حرير",
    color: "ذهبي",
    price: 2600,
    stock: 10,
    mainImage:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80",
    ],
    categorySlug: "luxury-bisht",
  },
];

async function seedUsers() {
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin123!";
  const customerPassword = "Customer123!";
  const [adminHash, customerHash] = await Promise.all([
    bcrypt.hash(adminPassword, 10),
    bcrypt.hash(customerPassword, 10),
  ]);

  const admin = await prisma.user.upsert({
    where: { email: "admin@albisht.store" },
    update: {
      name: "مدير المتجر",
      phone: "0500000000",
      role: "admin",
      passwordHash: adminHash,
    },
    create: {
      name: "مدير المتجر",
      email: "admin@albisht.store",
      phone: "0500000000",
      role: "admin",
      passwordHash: adminHash,
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: "customer@albisht.store" },
    update: {
      name: "عميل تجريبي",
      phone: "0501111111",
      role: "customer",
      passwordHash: customerHash,
    },
    create: {
      name: "عميل تجريبي",
      email: "customer@albisht.store",
      phone: "0501111111",
      role: "customer",
      passwordHash: customerHash,
    },
  });

  return { admin, customer };
}

async function seedCategories() {
  const categoryBySlug = new Map();

  for (const category of categoriesData) {
    const saved = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        nameAr: category.nameAr,
        description: category.description,
        imageUrl: category.imageUrl,
        isActive: true,
      },
      create: {
        ...category,
        isActive: true,
      },
    });
    categoryBySlug.set(saved.slug, saved);
  }

  return categoryBySlug;
}

async function seedProducts(categoryBySlug) {
  const productBySlug = new Map();

  for (const product of productsData) {
    const category = categoryBySlug.get(product.categorySlug);
    if (!category) continue;

    const saved = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        nameAr: product.nameAr,
        description: product.description,
        fabric: product.fabric,
        color: product.color,
        price: product.price,
        stock: product.stock,
        mainImage: product.mainImage,
        galleryImages: product.galleryImages,
        categoryId: category.id,
        isActive: true,
      },
      create: {
        nameAr: product.nameAr,
        slug: product.slug,
        description: product.description,
        fabric: product.fabric,
        color: product.color,
        price: product.price,
        stock: product.stock,
        mainImage: product.mainImage,
        galleryImages: product.galleryImages,
        categoryId: category.id,
        isActive: true,
      },
    });
    productBySlug.set(saved.slug, saved);
  }

  return productBySlug;
}

async function seedSampleOrder(customer, productBySlug) {
  const product = productBySlug.get("royal-black-gold");
  if (!product) return;

  const existing = await prisma.order.findFirst({
    where: {
      userId: customer.id,
      notes: "seed-order",
    },
    include: { items: true },
  });

  if (existing) {
    return;
  }

  const quantity = 1;
  const unitPrice = Number(product.price);
  const totalAmount = unitPrice * quantity;

  await prisma.order.create({
    data: {
      customerName: customer.name,
      phone: customer.phone,
      country: "Saudi Arabia",
      city: "Riyadh",
      address: "King Fahd Road, Building 10",
      notes: "seed-order",
      paymentMethod: "CARD",
      paymentStatus: "paid",
      totalAmount,
      status: "new",
      userId: customer.id,
      items: {
        create: [
          {
            productId: product.id,
            productName: product.nameAr,
            quantity,
            unitPrice,
          },
        ],
      },
    },
  });
}

async function main() {
  const { customer } = await seedUsers();
  const categoryBySlug = await seedCategories();
  const productBySlug = await seedProducts(categoryBySlug);
  await seedSampleOrder(customer, productBySlug);
}

main()
  .then(() => {
    console.log("Seeding completed successfully.");
  })
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

