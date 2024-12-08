import {PrismaClient} from '@prisma/client'

declare global {
	// eslint-disable-next-line no-var
	var __prisma: PrismaClient | undefined
}

if (!global.__prisma) {
	global.__prisma = new PrismaClient()
}

global.__prisma.$connect()

export const prisma: PrismaClient = global.__prisma
