class ConvertFruitIdToUuid1741712400000 {
  name = "ConvertFruitIdToUuid1741712400000";

  async up(queryRunner) {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);
    await queryRunner.query(`ALTER TABLE "fruits" ALTER COLUMN "id" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "fruits" ALTER COLUMN "id" TYPE uuid USING gen_random_uuid()`);
    await queryRunner.query(`ALTER TABLE "fruits" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()`);
    await queryRunner.query(`DROP SEQUENCE IF EXISTS "fruits_id_seq"`);
  }

  async down(queryRunner) {
    await queryRunner.query(`ALTER TABLE "fruits" ALTER COLUMN "id" DROP DEFAULT`);
    await queryRunner.query(`CREATE SEQUENCE "fruits_id_seq" OWNED BY NONE`);
    await queryRunner.query(`ALTER TABLE "fruits" ADD COLUMN "id_int" integer`);
    await queryRunner.query(`UPDATE "fruits" SET "id_int" = nextval('"fruits_id_seq"')`);
    await queryRunner.query(`ALTER TABLE "fruits" DROP CONSTRAINT "PK_fruits_id"`);
    await queryRunner.query(`ALTER TABLE "fruits" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "fruits" RENAME COLUMN "id_int" TO "id"`);
    await queryRunner.query(`ALTER TABLE "fruits" ALTER COLUMN "id" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "fruits" ALTER COLUMN "id" SET DEFAULT nextval('"fruits_id_seq"')`);
    await queryRunner.query(`ALTER SEQUENCE "fruits_id_seq" OWNED BY "fruits"."id"`);
    await queryRunner.query(`ALTER TABLE "fruits" ADD CONSTRAINT "PK_fruits_id" PRIMARY KEY ("id")`);
  }
}

module.exports = { ConvertFruitIdToUuid1741712400000 };
