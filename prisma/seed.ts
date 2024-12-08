import {PrismaClient} from '@prisma/client'
import {hashPassword} from '~/services/auth.server'

const prisma = new PrismaClient()

async function main() {
	// Clear existing data
	await prisma.item.deleteMany()
	await prisma.user.deleteMany()

	// Create seed data
	const users = await prisma.user.createMany({
		data: [
			{
				email: 'massimopalmieri@gmail.com',
				name: 'Massimo Palmieri',
				password: await hashPassword('hello'),
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
