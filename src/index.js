const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 3000;
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

// Middleware
app.use(morgan("dev"));
app.use(
  cors({
    origin: "*",
  })
);
app.use(helmet());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth.route"));
app.use("/api/users", require("./routes/users.route"));
app.use("/api/todos", require("./routes/todos.route"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Database and Server connection
const db = require("./models");

db.sequelize
  .sync()
  .then((req) => {
    console.log("Database connected...");
    app.listen(port, () => console.log(`Server listening on port ${port}`));
  })
  .catch((err) => {
    console.log("Error connecting to database: ", err);
  });
