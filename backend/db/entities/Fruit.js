const { EntitySchema } = require("typeorm");

const FruitEntity = new EntitySchema({
  name: "Fruit",
  tableName: "fruits",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
    name: {
      type: "varchar",
      length: 100,
    },
    color: {
      type: "varchar",
      length: 50,
    },
    in_season: {
      type: "boolean",
    },
  },
});

module.exports = { FruitEntity };
