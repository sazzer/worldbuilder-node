/* eslint-env mocha */
import senecaApp from "seneca";
import {expect} from "chai";
import moment from "moment-timezone";
import proxyquire from "proxyquire";
import {senecaAsPromised} from "seneca/promised";

describe("seneca debug actions", () => {
    const CURRENT_TIME = "2015-07-07T11:41:54+00:00";
    const now = moment(CURRENT_TIME);
    const momentStub = () => now;
    const debugActions = proxyquire("debug/actions", {
        "moment-timezone": momentStub
    });

    const seneca = senecaApp();
    seneca.use(debugActions);

    describe("cmd:ping", () => {
        describe("when called with no parameters", () => {
            const result = senecaAsPromised(seneca, {
                role: "debug",
                cmd: "ping"
            });

            it("Has the correct role", (done) => {
                expect(result).to.eventually.have.property("role")
                    .that.is.a("string")
                    .that.equals("debug")
                    .notify(done);
            });
            it("Has the correct cmd", (done) => {
                expect(result).to.eventually.have.property("cmd")
                    .that.is.a("string")
                    .that.equals("ping")
                    .notify(done);
            });
        });

        describe("when called with parameters", () => {
            const result = senecaAsPromised(seneca, {
                role: "debug",
                cmd: "ping",
                a: "b",
                c: 42
            });

            it("Has the correct role", (done) => {
                expect(result).to.eventually.have.property("role")
                    .that.is.a("string")
                    .that.equals("debug")
                    .notify(done);
            });
            it("Has the correct cmd", (done) => {
                expect(result).to.eventually.have.property("cmd")
                    .that.is.a("string")
                    .that.equals("ping")
                    .notify(done);
            });
            it("Has the property 'a'", (done) => {
                expect(result).to.eventually.have.property("a")
                    .that.is.a("string")
                    .that.equals("b")
                    .notify(done);
            });
            it("Has the property 'c'", (done) => {
                expect(result).to.eventually.have.property("c")
                    .that.is.a("number")
                    .that.equals(42)
                    .notify(done);
            });
        });
    });

    describe("cmd:now", () => {
        describe("when called with no parameters", () => {
            const result = senecaAsPromised(seneca, {
                role: "debug",
                cmd: "now"
            });

            it("Has the correct timezone", (done) => {
                expect(result).to.eventually.have.property("tz")
                    .that.is.a("string")
                    .that.equals("UTC")
                    .notify(done);
            });
            it("Has the correct time", (done) => {
                expect(result).to.eventually.have.property("now")
                    .that.is.a("string")
                    .that.equals(CURRENT_TIME)
                    .notify(done);
            });
        });

        describe("when called with an alternative timezone", () => {
            const result = senecaAsPromised(seneca, {
                role: "debug",
                cmd: "now",
                tz: "America/New_York"
            });

            it("Has the correct timezone", (done) => {
                expect(result).to.eventually.have.property("tz")
                    .that.is.a("string")
                    .that.equals("America/New_York")
                    .notify(done);
            });
            it("Has the correct time", (done) => {
                expect(result).to.eventually.have.property("now")
                    .that.is.a("string")
                    .that.equals(moment(CURRENT_TIME).tz("America/New_York").format())
                    .notify(done);
            });
        });
    });
});
