/**
 * Created by Adam_Kruppa on 8/7/2015.
 */
describe("First describe", function() {
    it("First example", function() {
        expect(true).toBe(true);
    });
});
describe("Second describe", function() {
    it("Second example", function() {
        expect(true).toBe(true);
    });
});

// In your node_modules, inside testem/lib folder, open browser_launcher.js, line ~123, change phantomjs to phantomjs.cmd. That worked for me. exe: 'phantomjs.cmd',