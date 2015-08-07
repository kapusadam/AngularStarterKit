/**
 * Created by Adam_Kruppa on 8/7/2015.
 */

cm.config(function($stateProvider, $urlRouterProvider) {
    //
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise("/main");
    //
    // Now set up the states
    $stateProvider
        .state('main', {
            url: "/main",
            templateUrl: "app/app/views/partials/main.html",
            controller: "MainController"
        });
});