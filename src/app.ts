import express from "express";
import config from "./util/config";
import { checkAuth } from "./interceptor/checks";
import { connection } from "./util/db";
import { deferrer } from "./util/promise2Observable";

const app = express();

import { router as gamesRoutes } from "./routes/games";
import { router as userRoutes } from "./routes/users";
import { addConnection } from "./interceptor/db";

app.use(checkAuth);
app.use(addConnection(connection));
app.use(express.json());

app.use(gamesRoutes);
app.use(userRoutes);

app.listen(config.PORT, () => {
  return console.log(`server is listening on ${config.PORT}`);
});
