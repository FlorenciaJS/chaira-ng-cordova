/*
 * Chaira SDK for Ionic
 * http://www.udla.edu.co
 *
 * DESCRIPTION:
 *
 * Angular Wrapper for Chaira API
 *
 * REQUIRES:
 *
 *    Apache Cordova 3.5+
 *    Apache InAppBrowser Plugin
 *    Apache Cordova Whitelist Plugin
 *
 */
angular.module("Chaira", [
    "Chaira.oauth",
    "Chaira.utils",
    "Chaira.provider"
])
  .config(function ($httpProvider) {
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
});
