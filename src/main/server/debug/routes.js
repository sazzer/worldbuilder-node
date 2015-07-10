import moment from "moment-timezone";

/**
 * Configure the touter for this stack
 * @param {Router} router the router to configure
 */
export function configureRoutes(router) {
    router.get("/debug/now", (req, res) => {
        const tz = req.query.tz || "UTC";
        const now = moment().tz(tz).format();

        res.send({
            tz,
            now
        });
    });

    router.get("/debug/ping", (req, res) => {
        res.send({
            query: req.query
        });
    });
}
