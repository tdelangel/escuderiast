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
   this.set('idform', params.id_formulario);
   return this.store.find('formulario',params.id_formulario);
 },
 setupController: function(controller, model) {

  /*-----------------------------------------------------------------------------*/
  this._super(controller, model);

  var JSONselectedEstado = null ;
  var JSONselectedTramite = null ;
  var JSONselectedTipoPago = null ;
  var JSONselectedDependencia = null;
  var JSONNombre = null;
  var isSelectedEstado = null;
  var isSelectedDependencia = null;
  var JSONStartDate = null;
  var JSONFinalDate = null;
  var estatus = null;
  var captcha = null;
  var valor =null;
  Ember.$.ajax({
   url: config.APP.REST_WSPREFIX+"/"+config.APP.WSSUFIX+'/formularios/'+this.get('idform'),
   type: 'GET',
   dataType: 'json',
   async:false
 }).done(function(jsonObject) {
   console.log('Este es el formulario edit'+ JSON.stringify(jsonObject.formulario.dependencia));
   JSONselectedEstado =(jsonObject.formulario.estado);
   JSONselectedTramite =(jsonObject.formulario.tramite);
   JSONselectedTipoPago =(jsonObject.formulario.pago);
   JSONselectedDependencia =(jsonObject.formulario.dependencia);
   JSONNombre =(jsonObject.formulario.nombre);
   JSONStartDate =(jsonObject.formulario.fecha_inicio);
   JSONFinalDate =(jsonObject.formulario.fecha_fin);
   estatus =(jsonObject.formulario.estatus);
   captcha =(jsonObject.formulario.captcha);

 });

 var fecha_actual = new Date();
 

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


/*Vaciado alos controleres*/
controller.set("dias",dias);
controller.set("meses",meses);
controller.set("anios",anios);

if (fecha_inicial !== undefined && fecha_inicial !== null && fecha_inicial!== "" && fecha_final!== undefined && fecha_final!== null && fecha_final!== ""){
  var fecha_inicial = new Date(JSONStartDate);
  var fecha_final = new Date(JSONFinalDate);


  //calcula las fechas si es menor a la fecha actual y el estatus es  2 es que esta en borrador
  if (fecha_actual.getTime() < fecha_inicial.getTime()  && estatus === 2 ){
   controller.set('activaBottons', true);

 }else if  (fecha_actual.getTime() > fecha_inicial.getTime() && fecha_actual.getTime() < fecha_final.getTime()){
  controller.set('activaBottons', false);
}else {
  controller.set('activaBottons', true);
}
}else{
 controller.set('activaBottons', true);
}

var localItem = JSON.parse(localStorage[config.APP.LS]);


var id_user = localItem.json.user_id;
var id_estado = localItem.json.estado;
if(localItem.json.estado!==null){
  controller.set('isSelectedEstados', false);
}
var role = localItem.json.role;

/* Validacion de si aparece el boton de publicar*/
if (role === "AD" || role === "EAD"){
  controller.set('btnPublicar',true);
}else if (role  === "ED" || role  === "EED"){
  controller.set('btnPublicar',false);  
}


if (role === 'ED' || role === 'AD' ){
  controller.set('admin',true);
  controller.set('viewTipoForm', false);
  controller.set('tramiteactive', false);
}
else if (role === 'EED' || role === 'EAD'){
  controller.set('admin',false);
  controller.set('viewTipoForm', false);
  controller.set('tramiteactive', false);
}else{
  controller.set('btnPublicar', true);
  controller.set('tramiteactive', true);
}

controller.set('editandoForm', true);

/*LLena los Controllers*/
controller.set('estados',  this.store.findAll('estado'));
controller.set('pagos',  this.store.findAll('pago'));
controller.set('tramites',  this.store.findAll('tramite'));
controller.set('dependencias',  this.store.findAll('dependency'));

controller.set('selectedEstado',JSONselectedEstado );
controller.set('selectedTramite',JSONselectedTramite );
controller.set('selectedTipoPago',JSONselectedTipoPago );
controller.set('selectedDependencia',JSONselectedDependencia);
controller.set('nameform',JSONNombre);
controller.set('startdate',JSONStartDate);
controller.set('finaldate',JSONFinalDate);
controller.set('estatus',estatus);
controller.set('captcha',captcha);


/**/
var dateInicial = JSONStartDate.split('-');
var dateFinal = JSONFinalDate.split('-');
controller.set ('initialDia', {"id": parseInt(dateInicial[2]),"description": dateInicial[2]});
controller.set ('initialMes',  {"id":parseInt(dateInicial[1]),"description": dateInicial[1]});
controller.set ('initialAnio', {"id":parseInt(dateInicial[0]),"description": dateInicial[0]});



controller.set ('finalDia',{"id": parseInt(dateFinal[2]),"description": dateFinal[2]});
controller.set ('finalMes',{"id":parseInt(dateFinal[1]),"description": dateFinal[1]});
controller.set ('finalAnio',{"id":parseInt(dateFinal[0]),"description": dateFinal[0]});

console.log(JSON.stringify(controller.get('finalDia')));
console.log(JSON.stringify(controller.get('finalMes')));
console.log(JSON.stringify(controller.get('finalAnio')));
controller.set('isedit', true);
controller.set('id_user', id_user);
controller.set('id_estado', id_estado);


if (role === 'SA'){

  if (JSONselectedEstado === undefined){
    isSelectedEstado = false ;
    isSelectedDependencia = true;
    controller.set('admin',false);
  } else {
    isSelectedEstado = true ;
    isSelectedDependencia = false;
    controller.set('admin',true);
  }

}else{
  isSelectedEstado = localItem.json.estado!==null?false:true;
  isSelectedDependencia = localItem.json.dependencia!==null?false:true;
}

controller.set('isSelectedEstados',isSelectedEstado);
controller.set('isSelectedDependencias',isSelectedDependencia);
/* se agrega*/
controller.set('tipoForm', [{id:1, text:'Formulario',description:'Forma'},{id:2,text:'Encuesta',description:'Encuesta'}]);
}
});
