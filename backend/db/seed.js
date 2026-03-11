const fs = require("fs/promises");
const path = require("path");
const { randomUUID } = require("crypto");
const AppDataSource = require("./data-source");
const { FruitEntity } = require("./entities/Fruit");

const dataPath = path.resolve(__dirname, "../data/fruitList.json");

async function seedFruit() {
  await AppDataSource.initialize();

  try {
    const raw = await fs.readFile(dataPath, "utf-8");
    const fruits = JSON.parse(raw).map((fruit) => ({
      id: randomUUID(),
      ...fruit,
    }));
    const repository = AppDataSource.getRepository(FruitEntity);

    await repository.clear();
    await repository.insert(fruits);

    console.log(`Seeded ${fruits.length} fruits.`);
  } finally {
    await AppDataSource.destroy();
  }
}

seedFruit().catch((error) => {
  console.error("Failed to seed fruits:", error);
  process.exitCode = 1;
});
