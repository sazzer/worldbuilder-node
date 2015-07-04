import senecaApp from "seneca";
import {expect} from "chai";

describe("seneca debug actions", () => {
    const seneca = senecaApp();
    seneca.use("debug/actions");

    describe("cmd:ping", () => {
        it("responds correctly with no parameters", () => {
            return new Promise((resolve, reject) => {
                seneca.act({role: "debug", cmd: "ping"}, (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                });
            }).then((result) => {
                expect(result).to.not.be.null;
                expect(result).to.have.property("role", "debug");
                expect(result).to.have.property("cmd", "ping");
            });
        });
    });
});
