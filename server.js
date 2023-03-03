import fs from "fs-extra";
import https from "https";
import express from "express";
import bodyParser from "body-parser";
import serveFavicon from "serve-favicon";
import cookieParser from "cookie-parser";

import { logger } from "./utils/logger.js";
import database from "./config/dbInitialization.config.js";
import errorHandler from "./middlewares/errorHandler.js";
import customerRouter from "./routers/customer.router.js";
import adminRouter from "./routers/admin.router.js";

// custom credentials - dev env only
const privateKey = fs.readFileSync("config/sslcert/key.pem", "utf8");
const certificate = fs.readFileSync("config/sslcert/server.crt", "utf8");
const credentials = { key: privateKey, cert: certificate };

const app = express();
const server = https.createServer(credentials, app);

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(errorHandler);

app.use("/", customerRouter);
app.use("/admin", adminRouter);
app.use("/assets", express.static("public/assets"));
app.use("/scripts", express.static("public/scripts"));

app.set("view engine", "pug");
app.set("views", "views");
app.use(serveFavicon("./public/assets/favicon/icon.ico"));

database.sequelize.sync();

server.listen(4000, () => {
    logger.info("Running at https://localhost:4000");
});