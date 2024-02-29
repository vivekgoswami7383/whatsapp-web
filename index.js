import express, { json, urlencoded } from "express";
const app = express();
import { constants } from "./src/helpers/constants.js";
import databaseConnection from "./src/database/connection.js";

const port = constants.AUTHENTICATION.PORT;

app.use(json());
app.use(urlencoded({ extended: true }));

import whatsappRoute from "./src/routers/whatsapp.routes.js";

app.use("/api", whatsappRoute);

databaseConnection()
  .then(() => {
    app.listen(port, async () => {
      console.log(`Server running on port ${port}`);
      console.log("✅ Connected to mongodb");
    });
  })
  .catch((error) => {
    console.log(error.message);
  });
