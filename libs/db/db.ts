import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { APP_ENV } from "@/app/env";


const adapter = new PrismaPg({ connectionString: APP_ENV.DATABASE_URL });

export const db = new PrismaClient({ adapter });
