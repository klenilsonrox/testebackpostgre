import {PrismaClient} from "@prisma/client"


const globalFormPrisma = globalThis as unknown as {prisma:PrismaClient}

export const prisma = globalFormPrisma.prisma || new PrismaClient()


if(process.env.NODE_ENV !=='production') globalFormPrisma.prisma=prisma

