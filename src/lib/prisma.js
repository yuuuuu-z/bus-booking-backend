import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { createRequire } from "module";
import { resolve } from "path";

const require = createRequire(import.meta.url);
const { PrismaClient } = require(
  resolve(process.cwd(), "generated/prisma/index.js"),
);

const connectionString = process.env.DATABASE_URL;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export default prisma;
