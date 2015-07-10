/* eslint-env mocha */
import {expect} from "chai";
import proxyquire from "proxyquire";
import sinon from "sinon";
import moment from "moment-timezone";

describe("debug actions", () => {
    describe("#configureRoutes", () => {
        const router = {};
        router.get = sinon.spy();

        const debugActions = proxyquire("debug/routes", {});
        debugActions.configureRoutes(router);

        it("Registered 3 routes", () => {
            expect(router.get.callCount).to.equal(3);
        });
        it("Registered a route for /debug/now", () => {
            expect(router.get.calledWithExactly("/debug/now", debugActions.nowHandler)).to.equal(true);
        });
        it("Registered a route for /debug/ping", () => {
            expect(router.get.calledWithExactly("/debug/ping", debugActions.pingHandler)).to.equal(true);
        });
        it("Registered a route for /debug/version", () => {
            expect(router.get.calledWithExactly("/debug/version", debugActions.versionHandler)).to.equal(true);
        });
    });

    describe("/now", () => {
        const CURRENT_TIME = "2015-07-07T11:41:54+00:00";
        const now = moment(CURRENT_TIME);
        const momentStub = () => now;
        const debugActions = proxyquire("debug/routes", {
            "moment-timezone": momentStub
        });

        describe("With no timezone", () => {
            const req = {
                query: {
                }
            };

            const res = {};
            res.send = sinon.spy();

            debugActions.nowHandler(req, res);
            const sent = res.send.getCall(0).args[0];
            it("Only sent one response", () => {
                expect(res.send.callCount).to.equal(1);
            });
            it("Sent a timezone of UTC", () => {
                expect(sent).to.have.property("tz")
                    .that.is.a("string")
                    .that.equals("UTC");
            });
            it("Sent the correct time", () => {
                expect(sent).to.have.property("now")
                    .that.is.a("string")
                    .that.equals(CURRENT_TIME);
            });
        });
        describe("With a timezone of UTC", () => {
            const req = {
                query: {
                    tz: "UTC"
                }
            };

            const res = {};
            res.send = sinon.spy();

            debugActions.nowHandler(req, res);
            const sent = res.send.getCall(0).args[0];
            it("Only sent one response", () => {
                expect(res.send.callCount).to.equal(1);
            });
            it("Sent a timezone of UTC", () => {
                expect(sent).to.have.property("tz")
                    .that.is.a("string")
                    .that.equals("UTC");
            });
            it("Sent the correct time", () => {
                expect(sent).to.have.property("now")
                    .that.is.a("string")
                    .that.equals(CURRENT_TIME);
            });
        });
        describe("With a timezone of America/New_York", () => {
            const req = {
                query: {
                    tz: "America/New_York"
                }
            };

            const res = {};
            res.send = sinon.spy();

            debugActions.nowHandler(req, res);
            const sent = res.send.getCall(0).args[0];
            it("Only sent one response", () => {
                expect(res.send.callCount).to.equal(1);
            });
            it("Sent a timezone of America/New_York", () => {
                expect(sent).to.have.property("tz")
                    .that.is.a("string")
                    .that.equals("America/New_York");
            });
            it("Sent the correct time", () => {
                expect(sent).to.have.property("now")
                    .that.is.a("string")
                    .that.equals("2015-07-07T07:41:54-04:00");
            });
        });
    });
});
