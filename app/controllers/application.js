import Ember from 'ember';
import config from '../config/environment';

var applicationController = Ember.Controller.extend({
	needs: ['login'],
	isLogged: false,
	isSelectedEstado:false,
	esSuperAdmin:false,
	linkReporte: config.APP.LinkReport,
	actions: {
		goToFormas: function() {
			console.log("formas -->");
			this.transitionToRoute('/formas');
		},		
		goToHome: function() {

			this.transitionToRoute('/home');
		},	
		goToUsers: function() {
			this.transitionToRoute('/users');
		},
		logout: function() {
			var controller = this;
			var localItem = JSON.parse(localStorage[config.APP.LS]);
			localStorage.setItem('href', config.APP.REST_WSPREFIX+"/"+"api/v1");
			var token =  localItem.json.access_token;
			console.log("apikey");
			var query = 'token='+token;
			Ember.$.ajax({
				url: config.APP.REST_WSPREFIX +"/"+config.APP.WSSUFIX+'/sessions/sign_out?' + query,
				type: 'POST'
			}).then(function() {
				delete window.localStorage[config.APP.LS];
				controller.set('id_usuario',null);
				controller.transitionToRoute('/login');
				controller.set('isLogged', false);
				controller.set('esSuperAdmin', false);

			});
		}
	}
});
export default applicationController;
