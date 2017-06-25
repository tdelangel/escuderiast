import Ember from 'ember';
import config from '../../config/environment';

export default Ember.Route.extend({
  id_dependencia:"",
  reportes:"",


 setupController: function(controller) {
	var localItem = JSON.parse(localStorage[config.APP.LS]);
var  id_dependencia =JSON.stringify(localItem.json.dependencia);

var url = "";
if (id_dependencia !== "null"  && id_dependencia !== "undefined"){
   url = config.APP.REST_WSPREFIX+"/"+config.APP.WSSUFIX+"/csv?id_dependencia="+id_dependencia;
}else {
   url = config.APP.REST_WSPREFIX+"/"+config.APP.WSSUFIX+"/csv";
}

  Ember.$.ajax({
   url: url ,
   type: 'GET',
   dataType: 'json',
   async:false
 }).done(function(jsonObject) {
controller.set('reportes', JSON.parse(JSON.stringify(jsonObject.csvs)));

});
}
});
