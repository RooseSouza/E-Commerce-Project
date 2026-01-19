const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./database/db");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/users", require("./routes/userRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
