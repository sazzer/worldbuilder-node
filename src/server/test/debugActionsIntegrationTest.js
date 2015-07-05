import senecaApp from "seneca";
import {expect} from "chai";
import {senecaAsPromised} from "seneca/promised";

describe("seneca debug actions", () => {
    const seneca = senecaApp();
    seneca.use("debug/actions");

    describe("cmd:ping", () => {
        it("responds correctly with no parameters", () => {
            return senecaAsPromised(seneca, {
                role: "debug",
                cmd: "ping"
            }).then((result) => {
                expect(result).to.not.be.null;
                expect(result).to.have.property("role", "debug");
                expect(result).to.have.property("cmd", "ping");
            });
        });
    });
});
