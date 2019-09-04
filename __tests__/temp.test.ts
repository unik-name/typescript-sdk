describe("Temporary test suite", () => {
    it("should pass", () => {
        expect(true).toBeTruthy();
    });

    it.skip("should be skipped", () => {
        expect("hello").toBe("world");
    });

    it.todo("should be todo");
});
