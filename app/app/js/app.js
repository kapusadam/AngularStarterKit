/**
 * Created by Adam_Kruppa on 8/6/2015.
 */


cm = angular.module("cm", ["ui.router", "ui.bootstrap", "common"])
    cm.run(function($rootScope) {
    // adds some basic utilities to the $rootScope for debugging purposes

    $rootScope.log = function(thing) {
        $log(thing);
    };

    $rootScope.alert = function(thing) {
        alert(thing);
    };
});

