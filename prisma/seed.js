import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const categoriesData = [
  {
    nameAr: "بشوت ملكية",
    slug: "royal-bisht",
    description: "تصاميم رسمية فاخرة للمناسبات الخاصة والملكية.",
  },
  {
    nameAr: "بشوت يومية",
    slug: "daily-bisht",
    description: "بشوت عملية بخامات خفيفة للمجالس والاجتماعات.",
  },
  {
    nameAr: "بشوت ذهبية",
    slug: "golden-bisht",
    description: "بشوت فاخرة بأطراف ذهبية لامعة.",
  },
];

const productsData = [
  {
    nameAr: "بشت ملكي أسود بخيوط ذهبية",
    slug: "royal-black-gold",
    description:
      "بشت ملكي مصنوع من أجود الأقمشة بخيوط ذهبية تمت حياكتها يدوياً لإطلالة فاخرة.",
    fabric: "صوف وخيوط حريرية",
    color: "أسود",
    price: 2200,
    stock: 15,
    mainImage:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80",
    categorySlug: "royal-bisht",
  },
  {
    nameAr: "بشت أبيض للأعياد",
    slug: "white-eid-bisht",
    description:
      "خيار مثالي للمناسبات الصباحية والأعياد بخامة خفيفة وتطريز ذهبي ناعم.",
    fabric: "مزيج قطني فاخر",
    color: "أبيض",
    price: 1400,
    stock: 20,
    mainImage:
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1200&q=80",
    categorySlug: "daily-bisht",
  },
  {
    nameAr: "بشت ذهبي مع تطريز فاخر",
    slug: "golden-premium-bisht",
    description:
      "قطعة فنية فاخرة بتفاصيل ذهبية عريضة، تناسب كبار الشخصيات والمناسبات الملكية.",
    fabric: "صوف كشمير",
    color: "ذهبي",
    price: 2600,
    stock: 10,
    mainImage:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=80",
    categorySlug: "golden-bisht",
  },
];

async function main() {
  const hashedPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || "Admin@123",
    10
  );

  await prisma.user.upsert({
    where: { email: "admin@albisht.store" },
    update: {
      name: "مدير المتجر",
      phone: "0000000000",
      passwordHash: hashedPassword,
      role: "admin",
    },
    create: {
      name: "مدير المتجر",
      phone: "0000000000",
      email: "admin@albisht.store",
      passwordHash: hashedPassword,
      role: "admin",
    },
  });

  for (const category of categoriesData) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        nameAr: category.nameAr,
        description: category.description,
        isActive: true,
      },
      create: { ...category, isActive: true },
    });
  }

  for (const product of productsData) {
    const category = await prisma.category.findUnique({
      where: { slug: product.categorySlug },
    });
    if (!category) continue;
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        nameAr: product.nameAr,
        description: product.description,
        fabric: product.fabric,
        color: product.color,
        price: product.price,
        stock: product.stock,
        mainImage: product.mainImage,
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
        categoryId: category.id,
        isActive: true,
      },
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

