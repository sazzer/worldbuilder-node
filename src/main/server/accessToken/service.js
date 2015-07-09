import moment from "moment-timezone";

/**
 * Set up all of the Seneca Actions for the Access Token service
 */
export default function() {
    const seneca = this;

    seneca.add({role: "token", cmd: "lookup"}, (args, done) => {
        if (!args.token) {
            console.log("No token provided");
            done("NO_TOKEN_PROVIDED");
        } else if (args.token !== "1234") {
            console.log("Invalid token provided");
            done("INVALID_TOKEN");
        } else {
            done(null, {
                token: args.token,
                userId: "abcdef",
                expires: moment().tz("UTC").add(1, "hours").format(),
                scopes: ["a", "b"]
            });
        }
    });
}
