import Ember from 'ember';
import config from '../../config/environment';


export default Ember.Route.extend({
	isedit :false,
	admin :false,
	btnPublicar :false,
	viewTipoForm :false,
	tramiteactive :false,
	activaBottons: true,
	model: function() {
		return this.store.createRecord('formulario');
	},
	setupController: function(controller, model) {
		this._super(controller, model);

		var localItem = JSON.parse(localStorage[config.APP.LS]);
		if(localItem.json.estado!==null){
			controller.set('isSelectedEstados', false);
		}
		
		controller.set('tipoForm', [{id:1, text:'Formujlario',description:'Forma'},{id:2,text:'Encuesta',description:'Encuesta'}]);
		controller.set ('plantillas', [{id:1, text:'DP',description:'Datos Sociodemográficos'},{id:2,text:'DC',description:'Datos de Contacto'}]);
		controller.set('selectedTipoForm', {id:2, text:'Encuesta',description:'Encuesta'});
		controller.set('dependencias',  this.store.findAll('dependency'));

		controller.set('estados',  this.store.findAll('estado'));
		controller.set('pagos',  this.store.findAll('pago'));
		controller.set('tramites',  this.store.findAll('tramite'));
		controller.set('isedit',false);
		controller.set('activaBottons', true);
		var role = localItem.json.role;
		var isSelectedEstado = null;
		var isSelectedDependencia = null;
		var valor =null;
		/*Va por la dependencia del usuario*/
		/* Meses en explorer */

		var mesesString  = "";
		for (var i = 1 ; i <=12; i++){
			if (i=== 1){
				mesesString = mesesString+ '{"id":"'+i+'","text":"0'+i+'","description":"0'+i+'"}'; 
			}
			else 
			{
				valor = ""+i;
				if (i<10){   valor = "0"+i;}
				mesesString = mesesString+ ',{"id":"'+i+'","text":"'+valor+'","description":"'+valor+'"}'; 
			}
		}
		/* Dias Explorer*/
		var meses = JSON.parse("[" + mesesString.toString() + "]");
		var diasString  = "";
		for (var j = 1 ; j <=31; j++){
			if (j === 1){
				diasString = diasString+ '{"id":"'+j+'","text":"0'+j+'","description": "0'+j+'"}'; 
			}
			else {
				valor = j;
				if (j<10){   valor = "0"+j;}
				diasString = diasString+ ',{"id":"'+j+'","text":"'+valor+'","description":"'+valor+'"}'; 
			}
		}
		var dias = JSON.parse("[" + diasString.toString() + "]");
/*
Anio Explorer*/
var anioString  = "";
for (var k = 1 ; k <=5; k++){


	valor = 2016+k;
	if (k == 1){
		anioString = anioString + '{"id":"'+valor+'","text":"'+valor+'","description":"'+valor+'"}'; 
	}
	else{
		anioString = anioString + ',{"id":"'+valor+'","text":"'+valor+'","description":"'+valor+'"}'; 
		
	}

}
var anios = JSON.parse("[" + anioString.toString() + "]");

console.log("Anios -----> "+JSON.stringify(anios));
console.log("meses-----> "+JSON.stringify(meses));
console.log("Dias -----> "+JSON.stringify(dias));
/*Vaciado alos controleres*/
controller.set("dias",dias);
controller.set("meses",meses);
controller.set("anios",anios);

		//console.log('ruter ' + 'role -->'+ role);
		
		if (role === 'EED'){
			controller.set('dependenciaUser', this.store.find("dependency", localItem.json.dependencia));
			controller.set("selectedDependencia", controller.get("dependenciaUser"));
		}
		/*Va por el estado*/
		else if (role === 'ED'){
			controller.set('estadoUser', this.store.find("estado", localItem.json.estado));
			controller.set("selectedEstado", controller.get("estadoUser"));
			
		}
		/* Validacion de si aparece el boton de publicar*/
		if (role === "AD" || role === "EAD"){
			controller.set('btnPublicar',true);
		}else if (role  === "ED" || role  === "EED"){
			controller.set('btnPublicar',false);	
		}

		/** Valida que tipo de usuario es*/
		if (role === 'ED' || role === 'AD' ){
			controller.set('admin',true);
			controller.set('viewTipoForm', false);
			controller.set('tramiteactive', false);
			isSelectedEstado =false;
		}
		else if (role === 'EED' || role === 'EAD'){
			controller.set('admin',false);
			controller.set('viewTipoForm', false);
			controller.set('tramiteactive', false);
			isSelectedDependencia = localItem.json.dependencia!==null?false:true;
		}else {
			controller.set('btnPublicar',true);
			controller.set('viewTipoForm', true);
			controller.set('tramiteactive', true);
			isSelectedEstado = localItem.json.estado!==null?false:true;
			isSelectedDependencia = localItem.json.dependencia!==null?false:true;
		}

		var id_user = localItem.json.user_id;


		var id_estado = localItem.json.estado;
		var dependencia = localItem.json.dependencia;


		controller.set('role',role);
		controller.set('id_usuario',id_user);
		controller.set('dependencia_id',dependencia);
		controller.set('id_estado',id_estado);
		//alert ("id_estado --->	"+id_estado)

		
		controller.set('isSelectedEstados',isSelectedEstado);
		controller.set('isSelectedDependencias',isSelectedDependencia);
		controller.set('selectedEstado', null);
		controller.set('selectedTramite', null);
		controller.set('selectedDependencia', null);
		controller.set('selectedTipoPago', null);
		controller.set('nameform',null);
		controller.set('startdate', null);
		controller.set('finaldate', null);
		controller.set('plantillasGet', null);

	}
});
