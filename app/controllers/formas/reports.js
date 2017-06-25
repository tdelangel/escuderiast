import Ember from 'ember';
import FormularioMixin from '../../mixins/formulario';
import config from '../../config/environment';
//import DragAndDrop from '../../bower_components/formBuilder/dist/form-builder.js';
export default Ember.Controller.extend(FormularioMixin,{
  actions: {
    goToReportes: function(nombreArchivo, id_dependencia) {

    //  var  urls = config.APP.LinkReport+ "/"+id_dependencia+"/"+url;
        var  url = config.APP.LinkReport+ "id_dependencia="+id_dependencia+"&nombre="+nombreArchivo;
     // console.log(url);
      window.location= url;
    }
  }
});
