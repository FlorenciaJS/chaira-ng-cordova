(function() {
    angular.module("Chaira.utils", [])

    .factory("$cordovaChairaUtility", cordovaChairaUtility);

    function cordovaChairaUtility($q, $http, $window) {
        return {

        /*
         * Mecanismo para refrescar el access_token
         *
         * @param    client_id
         * @return   object
         */

        refreshToken: function(client_id) {
            $http.post("http://chaira.udla.edu.co/api/v0.1/oauth2/authorize.asmx/refreshToken", { grant_type: "refresh_token", refresh_token: $window.localStorage.refresh_token, client_id: client_id, state: "xyz" })
                .then(function(data) {     
                    if (data.data.state == "OK") {
                        $window.localStorage.token = data.data.access_token;
                        $window.localStorage.refresh_token = data.data.refresh_token;
                        return {state: "OK"};
                    } else {
                        return {state: "error", detail: data.data.description};
                    }
                })
                .catch(function(error) {
                    return {state: "error", detail: "Ha ocurrido un problema"};
                });
        },

        /*
         * Check to see if the mandatory InAppBrowser plugin is installed
         * Comprobar si el plugin InAppBrowser está instalado
         *
         * @param
         * @return   boolean
         */

        isInAppBrowserInstalled: function() {
            var cordovaPluginList = cordova.require("cordova/plugin_list");
            var inAppBrowserNames = ["cordova-plugin-inappbrowser", "cordova-plugin-inappbrowser.inappbrowser", "org.apache.cordova.inappbrowser"];

            if (Object.keys(cordovaPluginList.metadata).length === 0) {
                var formatedPluginList = cordovaPluginList.map(
                    function(plugin) {
                        return plugin.id || plugin.pluginId;
                    });

                return inAppBrowserNames.some(function(name) {
                    return formatedPluginList.indexOf(name) != -1 ? true : false;
                });
            } else {
                return inAppBrowserNames.some(function(name) {
                    return cordovaPluginList.metadata.hasOwnProperty(name);
                });
            }
        }
    };
 }
    cordovaChairaUtility.$inject = ['$q','$http', '$window'];
})();
