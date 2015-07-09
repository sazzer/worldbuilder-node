import string from "string";
import {senecaAsPromised} from "seneca/promised";

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
            senecaAsPromised(req.seneca, {
                role: "token",
                cmd: "lookup",
                token: token.s
                }).then((accessToken) => {
                    const missingScopes = scopes.filter((v) =>
                        accessToken.scopes.indexOf(v) < 0);

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
                }).catch((error) => {
                    res.status(403).send({error: error.orig.code});
                });
        }
    };
}
