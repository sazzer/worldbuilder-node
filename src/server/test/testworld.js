import {expect} from "chai";
import proxyquire from "proxyquire";

describe("World", () => {
    describe("Unstubbed", () => {
        const {world} = proxyquire("world", {});

        it("Should return Hello", () => {
            expect(world()).to.equal("Hello, world");
        });
    });
    describe("Stubbed", () => {
        const {world} = proxyquire("world", {
            hello: {
                hello: (name) => "Hi there, " + name
            }
        });

        it("Should return Hello", () => {
            expect(world()).to.equal("Hi there, world");
        });
    });
});
