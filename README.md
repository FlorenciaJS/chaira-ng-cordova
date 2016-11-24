# ChairaNgCordova

El propósito de esta librería es facilitar la comunicación con el API rest de la Universidad de la Amazonía en proyectos que usan AngularJS y Apache Cordova/Phonegap como Ionic y Onsen UI.

## Requerimientos

* Apache Cordova 3.5+
* AngularJS
* [Apache Cordova InAppBrowser Plugin](http://cordova.apache.org/docs/en/3.0.0/cordova_inappbrowser_inappbrowser.md.html)
* [Apache Cordova Whitelist Plugin](https://github.com/apache/cordova-plugin-whitelist)


## Instalando ChairaNgCordova

### Via Bower:


    $ bower install chaira-ng-cordova --save

Esta acción instalará la librería y agregará la referencia al archivo `bower.json`.

Ahora deberá añadir la siguiente línea en su archivo **index.html** ubicado en el directorio **www** :

    <script src="../chaira-ng-cordova/dist/chaira-ng-cordova.min.js"></script>


### Inyectando en Angular:

La librería debe inyectarse en el arhcivo **app.js**, el cuál deberá verse de la siguiente manera:

    angular.module('yourapp', ['ionic', 'Chaira'])

También debe inyectarse e inicializarse el provider en la sección de configuración:

```javascript

  .config(function (ChairaProvider, ...) {

      ChairaProvider.init({
        'client_id': 'YOUR-CLIENT-ID', 
        'client_secret': 'YOUR-CLIENT-SECRET'
      });
   .....
```

Finalmente es necesario inyectar la factoria $Chaira en el controlador donde vaya a ser usada.


```javascript
.controller('myCtrl', function($Chaira, ....) {
	......
}
```


## Uso:

Existen 2 métodos, uno para autenticación y otro para realizar la consulta de un recurso:

    $Chaira.oauth(response_type);
	$Chaira.query(resource);

Ambos retornarán una promesa. Una respuesta exitosa devolverá un objeto y una respuesta errónea devolverá un string.

Ej:

```javascript

	$Chaira.oauth('code').then(
		function(result) {
    		console.log("Objeto devuelto -> " + JSON.stringify(result));
		},
		function(error) {
	    	console.log("Error -> " + error);
		}
	);
```


```javascript

	$Chaira.query('schedule').then(
		function(result) {
    		console.log("Objeto devuelto -> " + JSON.stringify(result));
    	},function(error) {
			console.log("Error -> " + error);
		}
	);
```

### Notas importantes:

- A la hora de registrar su app en la plataforma para desarrolladores de la Universidad de la Amazonia, usted debe usar **http://localhost/callback** como url de redirección (redirect_uri), ya que esta librería realiza algunas tareas cuando se encuentra en dicha url.


- Esta librería **NO** funcionará en el navegador web, ni con ionic serve, ionic live-reload, o ionic view.  **SOLAMENTE** funciona en un dispositivo físico o emulador AVD.


## TODO:

- Generar dinámicamente y validar State
- Verificar sesión (Si existe un token válido en el Local Storage)
- Directiva para botón Login
- Método Logout (Eliminar token de Local Storage)


Esta librería está basada en [ng-cordova-oauth](https://github.com/nraboy/ng-cordova-oauth) de Nic Raboy - [@nraboy](https://www.twitter.com/nraboy)