import { PrismaClient } from "@prisma/client";

const databaseService = new PrismaClient();

async function main() {
    await databaseService.chargingStationType.createMany({
        data: [
            { name: 'tiny', plugCount: 1, efficiency: 10, currentType: 'DC' },
            { name: 'small', plugCount: 2, efficiency: 20, currentType: 'DC' },
            { name: 'medium', plugCount: 3, efficiency: 30, currentType: 'AC' },
            { name: 'big', plugCount: 4, efficiency: 40, currentType: 'AC' },
            { name: 'huge', plugCount: 5, efficiency: 50, currentType: 'AC' }
        ]
    });
}

main()
  .then(async () => {
    await databaseService.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await databaseService.$disconnect()
    process.exit(1)
  });