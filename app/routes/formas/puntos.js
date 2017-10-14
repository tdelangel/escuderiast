import Ember from 'ember';
import config from '../../config/environment';

export default Ember.Route.extend({
  isedit:true,
  admin:false,
  model: function(params) {
 var  tom = this.store.query('punto', {
    id_forma: params.id_forma
});
 return tom;
   //return this.store.query('punto',{ "id_forma":params.id_formulario});
 },
 setupController: function(controller, model) {

  /*-----------------------------------------------------------------------------*/
  this._super(controller, model);

}
});