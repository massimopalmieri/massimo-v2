import {PrismaClient} from '@prisma/client'
import invariant from 'tiny-invariant'
import {hashPassword} from '~/services/auth.server'

const prisma = new PrismaClient()

async function main() {
	// Clear existing data
	await prisma.item.deleteMany()
	await prisma.user.deleteMany()

	invariant(process.env.ADMIN_EMAIL, 'ADMIN_EMAIL is required')
	invariant(process.env.ADMIN_PASSWORD, 'ADMIN_PASSWORD is required')

	// Create seed data
	const users = await prisma.user.createMany({
		data: [
			{
				email: process.env.ADMIN_EMAIL,
				password: await hashPassword(process.env.ADMIN_PASSWORD),
			},
		],
	})

	const items = await prisma.item.createMany({
		data: [
			{
				title: 'First Item',
				description: 'This is the first test item',
			},
			{
				title: 'Second Item',
				description: 'This is the second test item',
			},
		],
	})

	console.log('Seeding completed:', {users, items})
}

main()
	.catch((e) => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
