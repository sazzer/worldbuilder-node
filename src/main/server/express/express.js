import path from "path";
import express from "express";
import bodyParser from "body-parser";
import compression from "compression";
import staticFile from "connect-static-file";
import morgan from "morgan";
import responseTime from "response-time";
import errorHandler from "errorhandler";

/**
 * Configure the Express Server
 * @param {Array} apiRoutes The API Routes to register
 * @returns {Express} The Express Application
 */
export function configureExpress(apiRoutes) {

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

    const apiRouter = express.Router({
        caseSensitive: true,
        mergeParams: false,
        strict: false
    });

    for (const route in apiRoutes) {
        apiRoutes[route](apiRouter);
    }

    app.use("/api", apiRouter);

    return app;
}
