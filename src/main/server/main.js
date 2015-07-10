import sourceMapSupport from "source-map-support";
import path from "path";

import express from "express";
import bodyParser from "body-parser";
import compression from "compression";
import staticFile from "connect-static-file";
import morgan from "morgan";
import responseTime from "response-time";
import errorHandler from "errorhandler";

import {configureRoutes as configureDebugRoutes} from "debug/routes";

sourceMapSupport.install();

// Now set up Express to handle the HTTP side of things
const app = express();

app.use(compression());
app.use(bodyParser.json());
app.use(responseTime());
app.use(errorHandler());
app.use(morgan("combined"));

// Serve up the Static resources
app.use("/api/schema", staticFile(path.join(__dirname, "schema", "schema.json"), {
    etag: true,
    lastModified: true
}));

const router = express.Router({
    caseSensitive: true,
    mergeParams: false,
    strict: false
});

router.get("/worlds", (req, res) => {
    res.send({hello: "world"});
});

configureDebugRoutes(router);

app.use("/api", router);

app.listen(3000);
