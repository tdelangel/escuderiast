import Ember from 'ember';
import config from '../../config/environment';

export default Ember.Route.extend({
  isedit:true,
  admin:false,
  btnPublicar:false,
  idform:true,
  esEstado:false,
  viewTipoForm:false,
  editandoForm: false,
  tramiteactive :false,
  activaBottons:false,
  model: function(params) {
    console.log(params.id_forma);
   this.set('idform', params.id_forma);
   return this.store.find('punto',params.id_forma);
 },
 setupController: function(controller, model) {

  /*-----------------------------------------------------------------------------*/
  this._super(controller, model);

 
}
});
