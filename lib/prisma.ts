import "dotenv/config";
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '@prisma/client';

function env(name: string): string {
  const value = process.env[name]
  if (!(name in process.env)) {
    console.log(name);
    throw new Error(`❌ Missing environment variable: ${name}`)
  }
  return value
}

const adapter = new PrismaMariaDb({
  host: env("DATABASE_HOST"),
  user: env("DATABASE_USER"),
  password: env("DATABASE_PASSWORD"),
  database: env("DATABASE_NAME"),
  connectionLimit: 5,
})

const prisma = new PrismaClient({ adapter });

export { prisma }