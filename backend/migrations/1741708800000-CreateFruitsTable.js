class CreateFruitsTable1741708800000 {
  name = "CreateFruitsTable1741708800000";

  async up(queryRunner) {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);
    await queryRunner.query(`
      CREATE TABLE "fruits" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "name" character varying(100) NOT NULL,
        "color" character varying(50) NOT NULL,
        "in_season" boolean NOT NULL,
        CONSTRAINT "PK_fruits_id" PRIMARY KEY ("id")
      )
    `);
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP TABLE "fruits"`);
  }
}

module.exports = { CreateFruitsTable1741708800000 };
