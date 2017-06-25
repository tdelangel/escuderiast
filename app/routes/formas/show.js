import Ember from 'ember';
import config from '../../config/environment';

export default Ember.Route.extend({
  isedit:true,
selectedTramite: null,
  model: function(params) {
    return this.store.find('formulario',params.id_formulario );   
  },
  setupController: function(controller, model) {
    this._super(controller, model);

    var localItem = JSON.parse(localStorage[config.APP.LS]);

    if(localItem.json.estado!==null){
      controller.set('isSelectedEstados', false);
    }
    var selectedTramite = model;
   // console.log("selectedTramite in root: --------------------_> "+ JSON.stringify(selectedTramite));
    controller.set('selectedTramite',  selectedTramite );

    controller.set('estados',  this.store.findAll('estado'));
    controller.set('pagos',  this.store.findAll('pago'));
    controller.set('tramites',  this.store.findAll('tramite')); 
    controller.set('selectedEstado',model.estado);
    controller.set('isedit', true);

    var isSelectedEstado = localItem.json.estado!==null?false:true;

    controller.set('isSelectedEstados',isSelectedEstado);

  }
});

