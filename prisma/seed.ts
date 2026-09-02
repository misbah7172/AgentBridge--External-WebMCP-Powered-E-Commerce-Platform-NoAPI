import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../lib/password";

const prisma = new PrismaClient();
const categories = ["Laptops", "Smartphones", "Headphones", "Monitors", "Keyboards", "Mice", "Accessories"];
const products = [
  ["Nova 14 Pro Laptop", "Nova", "Laptops", 1299, 18], ["Apex 16 Gaming Laptop", "Apex", "Laptops", 1499, 12], ["Atlas Air 13 Laptop", "Atlas", "Laptops", 899, 24], ["Vector Studio 15", "Vector", "Laptops", 1099, 16], ["Vertex X Smartphone", "Vertex", "Smartphones", 899, 31], ["Vertex X Mini", "Vertex", "Smartphones", 649, 38], ["Nova Fold Smartphone", "Nova", "Smartphones", 1199, 9], ["Orbit One Phone", "Orbit", "Smartphones", 499, 43], ["Sonic ANC Headphones", "Sonic", "Headphones", 249, 42], ["Sonic Studio Headphones", "Sonic", "Headphones", 329, 21], ["Echo Buds Pro", "Echo", "Headphones", 159, 37], ["Wave Sport Earbuds", "Wave", "Headphones", 99, 65], ["Orbit 27 4K Monitor", "Orbit", "Monitors", 449, 14], ["Orbit 32 UltraWide", "Orbit", "Monitors", 699, 11], ["Vector 24 Monitor", "Vector", "Monitors", 229, 28], ["Apex 34 Gaming Monitor", "Apex", "Monitors", 549, 15], ["KeyForge 75 Keyboard", "KeyForge", "Keyboards", 159, 26], ["KeyForge Mini Keyboard", "KeyForge", "Keyboards", 99, 42], ["Orbit Ergo Keyboard", "Orbit", "Keyboards", 129, 30], ["Vector Travel Keyboard", "Vector", "Keyboards", 69, 56], ["Vector Pro Mouse", "Vector", "Mice", 89, 65], ["Apex Swift Mouse", "Apex", "Mice", 119, 33], ["Orbit Silent Mouse", "Orbit", "Mice", 49, 71], ["Nova Precision Mouse", "Nova", "Mice", 79, 48], ["Nova 100W Charger", "Nova", "Accessories", 59, 54], ["Orbit USB-C Hub", "Orbit", "Accessories", 89, 32], ["Vector Laptop Stand", "Vector", "Accessories", 69, 46], ["Sonic Audio Cable", "Sonic", "Accessories", 19, 88], ["Apex Webcam 4K", "Apex", "Accessories", 139, 23], ["Wave Power Bank", "Wave", "Accessories", 49, 60],
] as const;

async function main() {
  for (const name of categories) await prisma.category.upsert({ where: { slug: name.toLowerCase() }, update: { name }, create: { name, slug: name.toLowerCase() } });
  const categoryMap = new Map((await prisma.category.findMany()).map((category) => [category.name, category.id]));
  for (const [name, brand, category, price, stock] of products) {
    const slug = name.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-").replaceAll(/(^-|-$)/g, "");
    const product = await prisma.product.upsert({ where: { slug }, update: { name, brand, categoryId: categoryMap.get(category)!, price, stock, shortDescription: `${brand} ${name} for modern everyday use.`, description: `A dependable ${name} built for work, play, and everything in between.`, images: ["/placeholder-product.svg"], specifications: { brand, category } }, create: { name, slug, brand, categoryId: categoryMap.get(category)!, price, compareAtPrice: Math.round(price * 1.15), stock, rating: 4 + ((price % 9) / 10), reviewCount: 20 + (stock * 3), currency: "USD", shortDescription: `${brand} ${name} for modern everyday use.`, description: `A dependable ${name} built for work, play, and everything in between.`, images: ["/placeholder-product.svg"], specifications: { brand, category } } });
    await prisma.productVariant.upsert({ where: { sku: `${slug.toUpperCase()}-STD` }, update: { price, stock }, create: { productId: product.id, sku: `${slug.toUpperCase()}-STD`, price, stock, attributes: { color: "Black" } } });
  }
  const passwordHash = await hashPassword("DemoPass123!");
  await prisma.user.upsert({ where: { email: "demo@agentbridge.local" }, update: {}, create: { email: "demo@agentbridge.local", firstName: "Demo", lastName: "User", passwordHash } });
  await prisma.coupon.upsert({ where: { code: "SAVE10" }, update: {}, create: { code: "SAVE10", discountType: "PERCENTAGE", amount: 10, minimumOrder: 100, usageLimit: 1000 } });
  await prisma.coupon.upsert({ where: { code: "WELCOME25" }, update: {}, create: { code: "WELCOME25", discountType: "FIXED", amount: 25, minimumOrder: 200, usageLimit: 1000 } });
}

main().then(() => prisma.$disconnect()).catch(async (error) => { console.error(error); await prisma.$disconnect(); process.exit(1); });
