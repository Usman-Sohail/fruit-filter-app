const express = require("express");
const cors = require("cors");
const fruitRoutes = require("./routes/fruitRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api/fruit", fruitRoutes);

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
