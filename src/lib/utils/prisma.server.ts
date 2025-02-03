import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: import.meta.env.VITE_DATABASE_URL,
        }
    }
});

prisma.$connect()
    .then(() => {
        console.log('Connected to database');
    })
    .catch((error) => {
        console.error('Error connecting to database:', error);
    });

export { prisma };