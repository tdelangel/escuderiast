import Ember from 'ember';

export default Ember.Route.extend({
	
	model: function() {
		var params = {origen:true};
		let user = this.store.findAll('user',params);
    return user;
		
	},

	setupController: function(controller, model) {
		this._super(controller, model);

	},
	actions: {
		viewChanged: function() {
			this.refresh();
		}
	}
});
