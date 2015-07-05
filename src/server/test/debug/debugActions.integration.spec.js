import senecaApp from "seneca";
import {expect} from "chai";
import {senecaAsPromised} from "seneca/promised";

describe("seneca debug actions", () => {
    const seneca = senecaApp();
    seneca.use("debug/actions");

    describe("cmd:ping", () => {
        describe("when called with no parameters", () => {
            const result = senecaAsPromised(seneca, {
                role: "debug",
                cmd: "ping"
            });

            it("Has the correct role", (done) => {
                expect(result).to.eventually.have.property("role", "debug").notify(done);
            });
            it("Has the correct cmd", (done) => {
                expect(result).to.eventually.have.property("cmd", "ping").notify(done);
            });
        });
    });
});
