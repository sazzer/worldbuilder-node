import string from "string";

/** The name of the Authorization header */
const AUTHORIZATION_HEADER = "Authorization";
/** The expected prefix for the Authorization header */
const BEARER_PREFIX = "Bearer ";

/**
 * Middleware generator that produces Seneca Web middleware to ensure that the
 * current request is authenticated and is allowed access to the provided scopes
 * @param {Array} scopes The scopes to look for
 * @return {Function} middleware function to check the user is authenticated
 */
export function authenticated(scopes = []) {
    return (req, res, next) => {
        const authorization = string(req.header(AUTHORIZATION_HEADER) || "");

        if (authorization.s === "") {
            // No Authorization header was found
            res.status(401).send({
                "error": "NO_AUTHORIZATION_HEADER"
            });
        } else if (!authorization.startsWith(BEARER_PREFIX)) {
            // The Authorization header was of the wrong type
            res.status(401).send({
                "error": "INVALID_AUTHORIZATION_HEADER"
            });
        } else {
            // We have an Access Token. Let's work with it
            const token = authorization.chompLeft(BEARER_PREFIX);
            if (token.s !== "1234") {
                res.status(403).send({
                    "error": "INVALID_TOKEN"
                });
            } else {
                const userScopes = ["a", "b"];
                const missingScopes = scopes.filter((v) => userScopes.indexOf(v) < 0);

                if (missingScopes.length > 0) {
                    res.status(403).send({
                        "error": "UNAUTHORIZED",
                        "scopes": {
                            "required": scopes,
                            "missing": missingScopes
                        }
                    });
                } else {
                    next();
                }
            }
        }
    };
}
