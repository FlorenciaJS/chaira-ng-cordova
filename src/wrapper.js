(function() {
    'use strict';

    angular.module('Chaira.oauth', ['Chaira.utils', 'Chaira.provider'])

    .factory('$Chaira', chaira);

    function chaira($q, $http, $window, $cordovaChairaUtility, Chaira) {

        return {

            /*
             * Auth into the Chaira API
             *
             * @param    string response_type
             * @return   promise
             */

            oauth: function(response_type) {

                var deferred = $q.defer();
                if (window.cordova) {
                    if ($cordovaChairaUtility.isInAppBrowserInstalled()) {
                        var redirect_uri = "http://localhost/callback";
            
                        var flowUrl = "http://chaira.udla.edu.co/api/v0.1/oauth2/authorize.asmx/auth?client_id=" + Chaira.config.client_id + "&redirect_uri=" + redirect_uri + "&response_type=" + response_type + "&state=xyz";
                        var closeBrowser = true;

                        var browserRef = window.cordova.InAppBrowser.open(flowUrl, '_blank', 'location=no,clearsessioncache=yes,clearcache=yes,zoom=no,hidden=yes');
                        browserRef.addEventListener('loadstart', function(event) {

                            browserRef.addEventListener("loaderror", function(){
                                browserRef.close();
                                closeBrowser = false;
                                deferred.reject("problema de red");
                            });

                            browserRef.addEventListener('loadstop', function() {
                                browserRef.executeScript(
                                    { code: "document.getElementsByTagName(\"pre\")[0].innerHTML" },
                                    function(body) {

                                        var state = JSON.parse(body).state;

                                        if (state == "error"){
                                            browserRef.close();
                                            closeBrowser = false;
                                            deferred.reject(JSON.parse(body).description);
                                        }
                                        else {
                                            browserRef.insertCSS({code: "body {background-color:"+Chaira.config.login_bg_color+"}"});
                                            browserRef.show();
                                        }
                                    }
                                );                                
                            });

                            if ((event.url).indexOf(redirect_uri) === 0) {
                                browserRef.removeEventListener("exit", function(event) {});
                                browserRef.close();
                                closeBrowser = false;

                                var callbackResponse = (response_type == "code") ? (event.url).split("?")[1] : (event.url).split("#")[1];
                                var responseParameters = (callbackResponse).split("&");
                                var parameterMap = [];
                                for (var i = 0; i < responseParameters.length; i++) {
                                    parameterMap[responseParameters[i].split("=")[0]] = responseParameters[i].split("=")[1];
                                }
                                if (parameterMap.access_token !== undefined && parameterMap.access_token !== null || parameterMap.code !== undefined && parameterMap.code !== null) {

                                    if (response_type == "code") {
                                        $http.post("http://chaira.udla.edu.co/api/v0.1/oauth2/authorize.asmx/token", { grant_type: "authorization_code", code: parameterMap.code, client_id: Chaira.config.client_id, client_secret: Chaira.config.client_secret, redirect_uri: redirect_uri })
                                            .then(function(data) {
                                                if (data.data.state == "OK") {
                                                    $window.localStorage.token = data.data.access_token;
                                                    $window.localStorage.refresh_token = data.data.refresh_token;
                                                    deferred.resolve(data.data);
                                                } else {
                                                    deferred.reject(data.data.description);
                                                }
                                            })
                                            .catch(function(error) {
                                                deferred.reject("Ha ocurrido un problema");
                                            });

                                    } else {
                                        $window.localStorage.token = parameterMap.access_token;
                                        deferred.resolve({ access_token: parameterMap.access_token, expires_in: parameterMap.expires_in });
                                    }
                                } else {
                                    if ((event.url).indexOf("error_code=100") !== 0) {
                                        deferred.reject("Chaira returned error_code=100: Invalid permissions");
                                    } else {
                                        deferred.reject("Ha ocurrido un problema");
                                    }
                                }
                            }
                        });

                        browserRef.addEventListener('exit', function(event) {
                            if (closeBrowser) {
                                deferred.reject("El proceso ha sido cancelado");
                            }
                        });
                    } else {
                        deferred.reject("No se encontró el plugin InAppBrowser");
                    }
                } else {
                    deferred.reject("No se puede autenticar desde el navegador web");
                }
                return deferred.promise;
            },


            /*
             * Get Chaira Api Resource
             *
             * @param    string scope
             * @return   object
             */

            query: function(scope) {
                var deferred = $q.defer();
                $http.post("http://chaira.udla.edu.co/api/v0.1/oauth2/resource.asmx/scope", { access_token: $window.localStorage.token, scope: scope })
                    .then(function(data) {
                        if (data.data.type == "OK") {
                            deferred.resolve(data.data);
                        } else if (data.data.type == "invalid_token") {

                            if ($window.localStorage.refresh_token !== null) {
                                var scope = data.data.description;

                                $cordovaChairaUtility.refreshToken(Chaira.config.client_id)
                                .success(function(data) {
                                    if (data.state == "OK") {
                                        $window.localStorage.token = data.access_token;
                                        $window.localStorage.refresh_token = data.refresh_token;
                                        deferred.resolve({ state: "OK", description: scope, type: "OK" });
                                    } else {
                                        console.log("No se pudo refrescar el token");
                                         deferred.reject({state: "error", detail: data.description});
                                    }
                                })
                                .error(function(error) {
                                    console.log("ocurrion un error");
                                    deferred.reject({state: "error", detail: "No se obtuvo respuesta del servidor"});
                                });

                            } else {
                                deferred.resolve("No existe token de autenticación, debe iniciar sesión");
                            }
                        } else {
                            deferred.reject(data.data.description);
                            console.log(data.data);
                        }
                    })
                    .catch(function(error) {
                        deferred.reject({state: "error" , detail: "El servicio no está disponible"});
                    });
                return deferred.promise;
            }
        };
    }
    chaira.$inject = ['$q', '$http', '$window', '$cordovaChairaUtility', 'Chaira'];
})();
