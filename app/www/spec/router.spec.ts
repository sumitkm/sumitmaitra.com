
    describe("Expect", () => {
        describe("SPA Router", () => {
            it("is loaded", (done) => {
                require(["../st-app/st-router"], (router) => {
                    expect(router).not.toBe(null);
                    console.log("running");
                    done();
                });
            });
        });
    });
