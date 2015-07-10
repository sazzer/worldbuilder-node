import moment from "moment-timezone";
import path from "path";

/**
 * Handler for the /debug/now route, to get the current server time
 * @param {Request} req The current Request
 * @param {Response} res The current Response
 */
export function nowHandler(req, res) {
    const tz = req.query.tz || "UTC";
    const now = moment().tz(tz).format();

    res.send({
        tz,
        now
    });
}

/**
 * Handler for the /debug/ping route, to simply reply with the input params
 * @param {Request} req The current Request
 * @param {Response} res The current Response
 */
export function pingHandler(req, res) {
    res.send({
        query: req.query
    });
}

/**
 * Handler for the /debug/version route, to get the version of the deployed app
 * @param {Request} req The current Request
 * @param {Response} res The current Response
 */
export function versionHandler(req, res) {
    res.sendFile(path.join(__dirname, "..", "build.json"));
}

/**
 * Configure the touter for this stack
 * @param {Router} router the router to configure
 */
export function configureRoutes(router) {
    router.get("/debug/now", nowHandler);
    router.get("/debug/ping", pingHandler);
    router.get("/debug/version", versionHandler);
}
