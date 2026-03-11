const express = require("express");
const cors = require("cors");
const AppDataSource = require("./db/data-source");
const fruitRoutes = require("./routes/fruitRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api/fruit", fruitRoutes);

AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Backend running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to initialize database connection.", error);
    process.exit(1);
  });
