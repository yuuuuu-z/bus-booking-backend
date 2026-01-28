import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const provinces = [
  {
    name: "Phnom Penh",
    image:
      "https://oiewyhntmxkohsvqatjc.supabase.co/storage/v1/object/public/provinces/phnom-penh.jpeg",
  },
  {
    name: "Banteay Meanchey",
    image:
      "https://oiewyhntmxkohsvqatjc.supabase.co/storage/v1/object/public/provinces/banteay-meanchey.jpg",
  },
  {
    name: "Battambang",
    image:
      "https://oiewyhntmxkohsvqatjc.supabase.co/storage/v1/object/public/provinces/battambang.jpg",
  },
  {
    name: "Kampong Cham",
    image:
      "https://oiewyhntmxkohsvqatjc.supabase.co/storage/v1/object/public/provinces/kampong-cham.jpg",
  },
  {
    name: "Kampong Chhnang",
    image:
      "https://oiewyhntmxkohsvqatjc.supabase.co/storage/v1/object/public/provinces/kampong-chhnang.jpg",
  },
  {
    name: "Kampong Speu",
    image:
      "https://oiewyhntmxkohsvqatjc.supabase.co/storage/v1/object/public/provinces/kampong-speu.jpg",
  },
  {
    name: "Kampong Thom",
    image:
      "https://oiewyhntmxkohsvqatjc.supabase.co/storage/v1/object/public/provinces/kampong-thom.jpg",
  },
  {
    name: "Kampot",
    image:
      "https://oiewyhntmxkohsvqatjc.supabase.co/storage/v1/object/public/provinces/kampot.jpg",
  },
  {
    name: "Kandal",
    image:
      "https://oiewyhntmxkohsvqatjc.supabase.co/storage/v1/object/public/provinces/kandal.jpg",
  },
  {
    name: "Kep",
    image:
      "https://oiewyhntmxkohsvqatjc.supabase.co/storage/v1/object/public/provinces/kep.jpg",
  },
  {
    name: "Koh Kong",
    image:
      "https://oiewyhntmxkohsvqatjc.supabase.co/storage/v1/object/public/provinces/koh-kong.jpg",
  },
  {
    name: "Kratie",
    image:
      "https://oiewyhntmxkohsvqatjc.supabase.co/storage/v1/object/public/provinces/kratie.jpg",
  },
  {
    name: "Mondulkiri",
    image:
      "https://oiewyhntmxkohsvqatjc.supabase.co/storage/v1/object/public/provinces/mondulkiri.jpg",
  },
  {
    name: "Oddar Meanchey",
    image:
      "https://oiewyhntmxkohsvqatjc.supabase.co/storage/v1/object/public/provinces/oddar-meanchey.jpg",
  },
  {
    name: "Pailin",
    image:
      "https://oiewyhntmxkohsvqatjc.supabase.co/storage/v1/object/public/provinces/pailin.jpg",
  },
  {
    name: "Preah Sihanouk",
    image:
      "https://oiewyhntmxkohsvqatjc.supabase.co/storage/v1/object/public/provinces/preah-sihanouk.jpg",
  },
  {
    name: "Preah Vihear",
    image:
      "https://oiewyhntmxkohsvqatjc.supabase.co/storage/v1/object/public/provinces/preah-vihear.jpg",
  },
  {
    name: "Prey Veng",
    image:
      "https://oiewyhntmxkohsvqatjc.supabase.co/storage/v1/object/public/provinces/prey-veng.jpg",
  },
  {
    name: "Pursat",
    image:
      "https://oiewyhntmxkohsvqatjc.supabase.co/storage/v1/object/public/provinces/pursat.jpg",
  },
  {
    name: "Ratanakiri",
    image:
      "https://oiewyhntmxkohsvqatjc.supabase.co/storage/v1/object/public/provinces/ratanakiri.jpg",
  },
  {
    name: "Siem Reap",
    image:
      "https://oiewyhntmxkohsvqatjc.supabase.co/storage/v1/object/public/provinces/siem-reap.jpg",
  },
  {
    name: "Stung Treng",
    image:
      "https://oiewyhntmxkohsvqatjc.supabase.co/storage/v1/object/public/provinces/stung-treng.jpg",
  },
  {
    name: "Svay Rieng",
    image:
      "https://oiewyhntmxkohsvqatjc.supabase.co/storage/v1/object/public/provinces/svay-rieng.jpg",
  },
  {
    name: "Takeo",
    image:
      "https://oiewyhntmxkohsvqatjc.supabase.co/storage/v1/object/public/provinces/takeo.jpg",
  },
  {
    name: "Tboung Khmum",
    image:
      "https://oiewyhntmxkohsvqatjc.supabase.co/storage/v1/object/public/provinces/tboung-khmum.jpg",
  },
];
async function main() {
  for (const province of provinces) {
    await prisma.province.upsert({
      where: { name: province.name },
      update: {
        image: province.image,
      },
      create: {
        name: province.name,
        image: province.image,
      },
    });
  }
}

main()
  .then(() => console.log("✅ Provinces seeded"))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
