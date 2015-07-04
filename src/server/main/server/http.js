import express from "express";
import bodyParser from "body-parser";

/**
 * Start the HTTP server listening on the given port, and configured to use
 * the provided Seneca instance for actions
 * @param {number} port The port to listen on
 * @param {Seneca} seneca the Seneca instance to use
 */
export function startServer(port, seneca) {
    const app = express();

    app.use(bodyParser.json());

    // This is how you integrate Seneca with Express
    app.use(seneca.export("web"));

    app.listen(port);
}
