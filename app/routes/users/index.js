import Ember from 'ember';

export default Ember.Route.extend({
	
	model: function() {
		var params = {origen:true};
		return this.store.find('user',params);
		
	},

	setupController: function(controller, model) {
		this._super(controller, model);
		controller.set('estados',  this.store.findAll('estado'));
		controller.set('dependencias',  this.store.findAll('dependency'));

	},
	actions: {
		viewChanged: function() {
			this.refresh();
		}
	}
});
