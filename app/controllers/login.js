/*global $:false */
import Ember from 'ember';
import config from '../config/environment';
//import LoginControllerMixin from 'simple-auth/mixins/login-controller-mixin';

export default Ember.Controller.extend({
	//authenticator: 'simple-auth-authenticator:oauth2-password-grant'
	message: '',
	needs: ['application','home'],
	username: '',
	contrasena: '',
	actions: {
		authenticate: function() {
			console.log('authenticate');
			var identification = btoa(this.get('identification'));
			var password =  btoa(this.get('password'));
			var controller = this;
			var query = 'grant_type=password&username='+identification+'&password='+ password+'&origen=true';
			console.log('query');
			delete window.localStorage[config.APP.LS];
			if( identification !== undefined && password !== undefined) {
				
				controller.set('username', identification);
				controller.set('contrasena', password);


				Ember.$.ajax({
					url: config.APP.REST_WSPREFIX+"/"+config.APP.WSSUFIX +'/sessions/sign_in?' + query,
					type: 'POST'
				}).then(function(apikey) {
						console.log(apikey);
					if( !apikey.hasOwnProperty("error") ) {
						window.localStorage.setItem(config.APP.LS, JSON.stringify(apikey));


						controller.set('password', '');
						controller.get('identification', '');
						controller.transitionToRoute('/home');
						// TO GET USER
						//var localItem = JSON.parse(localStorage[config.APP.LS]);
						var userid = apikey.json.user_id;
						var isSelectedEstado= null;
						console.log (JSON.stringify(apikey.json));
						var role = apikey.json.role; 
						//se activa el icono de alta usuarios para administadores y super administradores
						if (role === 'SA' || role ===  'AD' || role ==='EAD'){
							isSelectedEstado = true;
						}
						else {
							isSelectedEstado = false;
						}
						//controller.set('user', this.store.find('user', userid));
						console.log('isLogged');
						controller.store.find('user', userid).then(function(user) {
							controller.set('user',user);
							controller.get('controllers.application').set('user',user);
						});
						//controller.get('controllers.application').set('isLogged', true);
						 this.set('application.isLoggedIn', true);
					


					} else {
						$('.alert').removeClass('hidden');
						controller.set('message', 'Usuario y contraseña no coinciden.');
						setTimeout(function () { $('.alert').addClass('hidden'); },3000);
					}
				});
			} else {
				$('.alert').removeClass('hidden');
				this.set('message', 'Debes de llenar ambos campos.');
				setTimeout(function () { $('.alert').addClass('hidden'); },3000);
			}
		},
		goToSolicitud: function() {
			this.transitionToRoute('solicitud');
		}
	}
});
