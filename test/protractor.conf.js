/**
 * Created by Adam_Kruppa on 8/8/2015.
 */
exports.config = {
    //seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['test/spec-e2e/*_spec.js'],
    seleniumServerJar: '../node_modules/protractor/selenium/selenium-server-standalone-2.45.0.jar'
};