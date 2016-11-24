(function() {
  angular.module('Chaira.provider', [])

    .provider('Chaira',Chaira);
      function Chaira () {
        
        this.init = function (config) {
          this.config = config;
        };

        this.$get = function () {
          return this;
        };

      }

  Chaira.$inject = [];

})();
