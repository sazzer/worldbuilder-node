import {expect} from "chai";
import sinon from "sinon";
import {senecaAsPromised} from "seneca/promised";

describe("seneca/promised", () => {
    describe("When the action returns success", () => {
        const seneca = {};
        seneca.act = sinon.stub()
            .withArgs({a: "b"})
            .yieldsAsync(null, "Success");

        const promise = senecaAsPromised(seneca, {a: "b"});

        it("Resolves the Promise with the correct value", (done) => {
            expect(promise).to.eventually.equal("Success").notify(done);
        });
    });

    describe("When the action returns failure", () => {
        const seneca = {};
        seneca.act = sinon.stub()
            .withArgs({a: "b"})
            .yieldsAsync("Error");

        const promise = senecaAsPromised(seneca, {a: "b"});

        it("Rejects the Promise with the correct value", (done) => {
            expect(promise).to.eventually.be.rejectedWith("Error").notify(done);
        });
    });
});
