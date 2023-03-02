const fs = require("fs-extra");
const https = require("https");
const privateKey = fs.readFileSync("config/sslcert/key.pem", "utf8");
const certificate = fs.readFileSync("config/sslcert/server.crt", "utf8");

// custom credentials - dev env only
const credentials = { key: privateKey, cert: certificate };

const express = require("express");
const app = express();
const server = https.createServer(credentials, app);
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const favicon = require("serve-favicon");
const logger = require("./utils/logger");

const database = require("./models/initialization");

const publicRouter = require("./routers/customer.router");
const adminRouter = require("./routers/admin.router");

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use("/", publicRouter);
app.use("/admin", adminRouter);

app.use("/assets", express.static("public/assets"));
app.use("/scripts", express.static("public/scripts"));
app.set("view engine", "pug");
app.set("views", "views");
app.use(favicon("./public/assets/favicon/icon.ico"));

database.sequelize.sync();

server.listen(4000, () => {
    logger.info("Running at https://localhost/4000");
});