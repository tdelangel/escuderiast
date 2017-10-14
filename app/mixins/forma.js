import Ember from 'ember';
import config from '../config/environment';

export default Ember.Mixin.create({
  needs: ['formas/index'],
isSaved: false, // START WITH FALSE
isActionType: false,
isActive: true,
isNew: false,
isComplete: true,
isPublished:false,

loadForma: function() {
  console.log ('LoadForm--->');
  this.set('selectedEstado', null);
  this.set('selectedTipoPago', null);
  this.set('selectedTramite', null);
  this.set('selectedDependencia', null);
  this.set('selectedTipoForm', null);
  this.set('nameform', null);
  this.set('startdate', null);
  this.set('finaldate', null);
  this.set('plantillas', null);

  console.log ("json create form --->"+ JSON.stringify(localItem.json));
},
activateSaveForm: function() {
 var controller = this;




    var rv = -1; // Return value assumes failure.

    if (navigator.appName === 'Microsoft Internet Explorer'){

     var ua = navigator.userAgent,
     re  = new RegExp("MSIE ([0-9]{1,}[\\.0-9]{0,})");

     if (re.exec(ua) !== null){
       rv = parseFloat( RegExp.$1 );
     }
   }
   else if(navigator.appName === "Netscape"){                       
       /// in IE 11 the navigator.appVersion says 'trident'
       /// in Edge the navigator.appVersion does not say trident
       if(navigator.appVersion.indexOf('Trident') === -1) rv = 12;
       else rv = 11;
     } 

     var explorer = rv;

      if (explorer == 11){

  var diaInitial = controller.get('initialDia');
  var mesInitial = controller.get('initialMes');
  var anioInitial = controller.get('initialAnio');

if (anioInitial !== null && anioInitial !== undefined  && anioInitial !== "" ){
  var fechaExplorer = JSON.stringify(anioInitial.description)+"-"+ JSON.stringify(mesInitial.description)+ "-"+ JSON.stringify(diaInitial.description);
  fechaExplorer = fechaExplorer.replace(/\"/g, "")
  startDate = fechaExplorer;
this.set('startdate', fechaExplorer);
}
  var diaFinal = controller.get('finalDia');
  var mesFinal = controller.get('finalMes');
  var anioFinal = controller.get('finalAnio');

if (anioFinal !== null && anioFinal !== undefined  && anioFinal !== "" ){
  var fechaExplorerFinal = JSON.stringify(anioFinal.description)+"-"+ JSON.stringify(mesFinal.description)+ "-"+ JSON.stringify(diaFinal.description);
  fechaExplorerFinal = fechaExplorerFinal.replace(/\"/g, "")
  this.set('finaldate', fechaExplorerFinal);
}

} 

 this.set('isSaved', false);
 var localItem = JSON.parse(localStorage[config.APP.LS]);
// console.log ("json create form --->"+ JSON.stringify(localItem.json));
localStorage.setItem('href', config.APP.REST_WSPREFIX+"/"+"api/v2");
var role = localItem.json.role;

//verifica la dependencia o estado asociado al usuario'
//verifica  si se evalua como formulario de admin/editor o de superadmin

var isEstadoActivo = false;
var isDependenciaActivo = false;

var editandoForm = this.get('editandoForm');
/* Es super admin*/
if (role === 'SA' ){
  if (editandoForm){
    this.set('viewTipoForm', false);
  }
  var tipoform = this.get('selectedTipoForm.id');

  if (tipoform === 1){
   this.set('isEncuesta',true);
   this.set('isSelectedEstados',true);
   isEstadoActivo = true;
   this.set('admin',true);
 }else if(tipoform === 2) {
   this.set('isSelectedEstados',false);
   isEstadoActivo = false;
   this.set('admin',false);
 }
 isDependenciaActivo = true;
 /*Es usuario con rol de actas */
} else if (role === "ED" || role === "AD" ) {
  this.set('viewTipoForm', false);
  this.set('isSelectedEstados',false);

  isEstadoActivo = true;
  /*Busqueda del estado*/

  /*roles de encuestas*/
}else if (role === "EED" || role === "AAD" ) {

  this.set('viewTipoForm', false);
  this.set('isSelectedEstados',false);
  isEstadoActivo = false;
  isDependenciaActivo = false;
}
else {
  this.set('viewTipoForm', false);

}
this.set('isUpdated',true);
/**diferenciamos si es un formulario de actas */
if(this.get('admin')){
  var isEstado = true;
  var isTramitef = true;
  var isPago = true;
  var isNameformf = true;

  controller.set('userTramite', this.store.find("tramite","1"));
  if(isEstadoActivo){

    /* Verificamos si es un super o es un admin de actas o es un editor*/
    if (this.get('viewTipoForm')){


      if( this.get('selectedEstado') !== null && this.get('selectedEstado') !== undefined) {
        isEstado = false;
      }

      if(this.get('selectedTipoPago') !== null && this.get('selectedTipoPago') !== undefined) {
        isPago = false;
      }
      if(this.get('selectedTramite') !== null && this.get('selectedTramite') !== undefined) {
       isTramitef = false;
     }

     if (this.get('nameform') !== null && this.get('nameform')!== undefined && this.get('nameform')!== "") {
       isNameformf = false;
     }

     if (isEstado === false && isTramitef === false && isPago === false && isNameformf === false){
       this.set('isActive', false);
     }
     else{
       this.set('isActive', true);
     }
   }
   else {/* validamos el nombre y el tipo de pago para admin AD y editor ED*/
    if(this.get('selectedTipoPago') !== null && this.get('selectedTipoPago') !== undefined) {
      isPago = false;
    }

    if (this.get('nameform') !== null && this.get('nameform')!== undefined && this.get('nameform')!== "") {
     isNameformf = false;
   }

   if ( isPago === false && isNameformf === false){
     this.set('isActive', false);
   }
   else{
     this.set('isActive', true);
   }
 }
}

/*Diferenciamos si es una encuesta*/

}else {

  controller.set('userTramite', this.store.find("tramite","2"));

  
  var isDependencia = true;
  var isTramite = true;
  var isNameform = true;
  var startDate = true;
  var finalDate = true;
  if (isDependenciaActivo){
    if(this.get('isSelectedDependencia')===true){
      if( this.get('selectedDependencia') !== null && this.get('selectedDependencia') !== undefined) {
        isDependencia = false;
      }
    }else{
      if(this.get('selectedDependencia') !== null && this.get('selectedDependencia') !== undefined) {
       isDependencia = false;
     }
     if(this.get('selectedTramite') !== null && this.get('selectedTramite') !== undefined) {
       isTramite = false;
     }

     if (this.get('nameform') !== null && this.get('nameform')!== undefined && this.get('nameform')!== "") {
       isNameform = false;
     }
   

     if (this.get('startdate') !== null && this.get('startdate')!== undefined && this.get('startdate')!== "") {
       startDate = false;
       /* Validacion para IE*/
     } 
    if (this.get('finaldate') !== null && this.get('finaldate')!== undefined && this.get('finaldate')!== "") {
      if (startDate === false){
        finalDate = (new Date(this.get('finaldate')) > new Date(this.get('startdate'))) ? false:true;

      }
    }
    /*validamos pára IE */
 
  }
  if (isDependencia === false  && isTramite === false && isNameform === false && startDate === false && finalDate === false){
    this.set('isActive', false);
  }
  else{
   this.set('isActive', true);
 }

} else{
  if (this.get('nameform') !== null && this.get('nameform')!== undefined && this.get('nameform')!== "") {
    this.set('isActive', false);
  }else {
    this.set('isActive', true);
  }

}

}



}.observes('selectedDependencia', 'nameform','selectedEstado', 'selectedTramite','selectedTipoPago', 'selectedTipoForm' ,'startdate', 'finaldate'),
actions: {
 previousPage: function(){
      // Just a small tweak to the previous button
      // if by any chance the user hits a url that
      // has a page that is higher than the actual total pages (this is only possible manually)
      // as he tries to come back to the previous page
      // he will get the last possible page number
      var totalPages = Math.ceil(this.get('total')/this.get('limit'));
      if(this.decrementProperty('page') > totalPages){
        this.set('page', totalPages);
      }

      this.transitionToRoute({
        queryParams: {
          page: this.get('page')
        }
      });
    },
    nextPage: function(){
      this.transitionToRoute({
        queryParams: {
          page: this.incrementProperty('page')
        }
      });
    },   
    UpdateFormulario: function(status) {


    var rv = -1; // Return value assumes failure.

    if (navigator.appName == 'Microsoft Internet Explorer'){

     var ua = navigator.userAgent,
     re  = new RegExp("MSIE ([0-9]{1,}[\\.0-9]{0,})");

     if (re.exec(ua) !== null){
       rv = parseFloat( RegExp.$1 );
     }
   }
   else if(navigator.appName == "Netscape"){                       
       /// in IE 11 the navigator.appVersion says 'trident'
       /// in Edge the navigator.appVersion does not say trident
       if(navigator.appVersion.indexOf('Trident') === -1) rv = 12;
       else rv = 11;
     } 

     var explorer = rv;


 // console.log(status);
 var controller = this;
 var formulario = this.get('model');
 var estado = controller.get('selectedEstado.id');
 var dependencia = controller.get('selectedDependencia.id');
 var tramite = controller.get('selectedTramite.id');
 var tipoPago = controller.get('selectedTipoPago.id');
 var idusuario = controller.get('id_user');
 var nameform = controller.get('nameform');
 var startDate = null; 
 var finalDate = null;
  if (explorer == 12){
   startDate = controller.get('startdate');
   finalDate = controller.get('finaldate');

 }
 else {
  var diaInitial = controller.get('initialDia');
  var mesInitial = controller.get('initialMes');
  var anioInitial = controller.get('initialAnio');
if (anioInitial !== null && anioInitial !== undefined  && anioInitial !== "" ){

   var fechaExplorer = JSON.stringify(anioInitial.description)+"-"+ JSON.stringify(mesInitial.description)+ "-"+ JSON.stringify(diaInitial.description);
  fechaExplorer = fechaExplorer.replace(/\"/g, "")
  startDate = fechaExplorer;
}
 

  var diaFinal = controller.get('finalDia');
  var mesFinal = controller.get('finalMes');
  var anioFinal = controller.get('finalAnio');
if (anioFinal !== null && anioFinal !== undefined  && anioFinal !== "" ){
  var fechaExplorerFinal = JSON.stringify(anioFinal.description)+"-"+ JSON.stringify(mesFinal.description)+ "-"+ JSON.stringify(diaFinal.description);
  fechaExplorerFinal = fechaExplorerFinal.replace(/\"/g, "")
  finalDate = fechaExplorerFinal;

}
}

var admin = controller.get('admin');
var flag  = false;
var ctrlDateInicial  = false;
var faltantes = 0;
var faltaName = false;
var captcha  = controller.get('captcha');

if (estado === "" || estado === null || estado === undefined ){
 estado = controller.get('id_estado');
}  if (dependencia === "" || dependencia === null || dependencia === undefined ){
 dependencia = controller.get('dependencia');
}

if(tramite === null || tramite === undefined || tramite === '') {
  flag = true;
  controller.set('txEvent', true);
  controller.set('txMessage','Debe seleccionar un tramite');
}
if(admin){
  if(tipoPago === null || tipoPago === undefined || tipoPago === '') {
    flag = true;
    controller.set('txEvent', true);
    controller.set('txMessage','Debe seleccionar el tipo de pago del tramite');
  }


  if(estado === null || estado === undefined || estado === '') {
    flag = true;
    controller.set('txEvent', true);
    controller.set('txMessage','Debe seleccionar el estado al que pertenece el Tramite');
  }
}else{
  if(dependencia === null || dependencia === undefined || dependencia === '') {
    flag = true;
    controller.set('txEvent', true);
    controller.set('txMessage','Debe seleccionar la dependencia al que pertenece el Tramite');

  }


  if(startDate === null || startDate === undefined || startDate === '') {
    flag = true;
    ctrlDateInicial = true;
    controller.set('txEvent', true);
    controller.set('txMessage','Debe seleccionar fecha de inicio de la encuesta');
  }


  if(finalDate === null || finalDate === undefined || finalDate === '') {
    flag = true;
    controller.set('txEvent', true);
    controller.set('txMessage','Debe seleccionar fecha de finalización de la encuesta');

  }


  
  else {
   if (ctrlDateInicial === false){
    flag = (new Date(finalDate) < new Date(startDate)) ? true:false;
    if (flag){
      controller.set('txEvent', true);
      controller.set('txMessage','Debe seleccionar fecha de finalización de la encuesta superior a la inicial');
    }
  }
}
}

if (tipoPago === undefined){
  tipoPago = null;
}
if (dependencia === undefined){
  dependencia = null;
}

/* VAlidacion de repetidos*/
var data =  localStorage.getItem('JsonForm');
var att_name = "";
var  obj = JSON.parse(data);
console.log('atributos  --->'+obj);
Ember.$.each(obj.atributos, function(i) {

  if (obj.atributos[i].type !== 'hr'){
    if (obj.atributos[i].name === undefined){
      faltantes +=  1;

      if (obj.atributos[i].type === 'header'){
        controller.set('txMessage',"Existen un elemento "+obj.atributos[i].element+" que no tienen un nombre asignado. Por favor asignelos. para continuar");
      }else  {
        controller.set('txMessage',"Existen un elemento "+obj.atributos[i].type+" que no tienen un nombre asignado. Por favor asignelos. para continuar");
      }
      controller.set('txEvent', true);
    }

  }
  if (obj.atributos[i].type === 'button'){
   if (obj.atributos[i].urlbutton === undefined){
    faltantes +=  1;

    controller.set('txMessage',"Existe un elemento "+obj.atributos[i].type+" que no tiene asignado una url. Por favor asignelos. para continuar");
    controller.set('txEvent', true);
  }  
  if (obj.atributos[i].label === undefined){
    faltantes +=  1;

    controller.set('txMessage',"Existe un elemento "+obj.atributos[i].type+" que no tiene asignado una etiqueta. Por favor asignelos. para continuar");
    controller.set('txEvent', true);
  }
}

if ( obj.atributos[i].name !== undefined){
  att_name += ","+ obj.atributos[i].name;
}
});
if (faltantes === 0){
  faltaName = false;
}
else {
  faltaName = true;
}
var uniqueList=att_name.split(',').filter(function(allItems,i,a){
  return i===a.indexOf(allItems);
}).join(',');

if (uniqueList !== att_name){
 controller.set('txMessage','Existen campos Repetidos favor de verificar');
 controller.set('txEvent', true);
 flag = true;
}
var sdate = null;
var fdate = null;
if (startDate !== undefined && finalDate !== undefined){
 sdate = new Date(startDate);
 fdate = new Date (finalDate);
}

if(data!==null && data!== undefined && flag === false && faltaName === false){


  var atributos =JSON.parse(data);
  var bodyForm = {"id":formulario.get('id'), "atributos": atributos.atributos, "formulario":
  {
    "usuario": idusuario,
    "tramite":tramite,
    "estado":estado,
    "pago":tipoPago,
    "status":status,
    "nombre":nameform,
    "dependencia":dependencia,
    "fecha_inicio": sdate,
    "fecha_fin":fdate,
    "captcha":captcha
  }};
//console.log(bodyForm);
var parentController = controller.get('controllers.formas/index');
Ember.$.ajax({
         //  url: config.ENV.APP.REST_WSPREFIX + ENV.APP.REST_WSSUFIXFORM,
         url: config.APP.REST_WSPREFIX+"/"+config.APP.WSSUFIX+'/formas/'+formulario.get('id'),
         type: 'PUT',
         dataType: 'json',
         contentType: 'application/json',
         data: JSON.stringify(bodyForm)
       })
.done(function(result) {

 var errorResult  = JSON.stringify(result.error);
 if (errorResult !== undefined){

  controller.set('isSaved', false);
  controller.set('txEvent',true);
  controller.set('txMessage',result.error);
  setTimeout(function () {
    if(controller!==null) {
      controller.set('txEvent', false);
      controller.set('txMessage', '');
     //   localStorage.setItem('JsonForm',"");
   }
 },6000);
}
else{

  controller.set('isSaved', false);
  parentController.set('txEvent',true);
  parentController.set('txMessage','Formulario Actualizado');
  setTimeout(function () {
    if(parentController!==null) {
      parentController.set('txEvent', false);
      parentController.set('txMessage', '');
    }
  },2000);

  localStorage.setItem('JsonForm',"");
  controller.transitionToRoute('/formas');
}



})
.fail(function(result) {
  controller.set('txEvent',true);
  controller.set('txMessage','Error al Actualizar el formulario' + result);
  setTimeout(function () {
    if(controller!==null) {
      controller.set('txEvent', false);
      controller.set('txMessage', '');
    }
  },5000);

  localStorage.setItem('JsonForm',"");
  controller.transitionToRoute('/formas');

});
}
else {
  setTimeout(function () {
    if(controller!==null) {
      controller.set('txEvent', false);
      controller.set('message', '');
    }
  },5000);
}
},

createFormulario: function(status) {


    var rv = -1; // Return value assumes failure.

    if (navigator.appName == 'Microsoft Internet Explorer'){

     var ua = navigator.userAgent,
     re  = new RegExp("MSIE ([0-9]{1,}[\\.0-9]{0,})");

     if (re.exec(ua) !== null){
       rv = parseFloat( RegExp.$1 );
     }
   }
   else if(navigator.appName == "Netscape"){                       
       /// in IE 11 the navigator.appVersion says 'trident'
       /// in Edge the navigator.appVersion does not say trident
       if(navigator.appVersion.indexOf('Trident') === -1) rv = 12;
       else rv = 11;
     } 

     var explorer = rv;

  console.log("crearForm");
  this.set('isUpdated', false);
  var controller = this;
  var id_estado = null;

  var captcha  = controller.get('captcha');
//alert(captcha);

var id_tramite = controller.get('selectedTramite');
var tramiteid =null;
var plantillas = null;
var tramite = null;
var id_tipo_pago = null;
var nombre = controller.get('nameform');
var dependency = null;
var dateinicio = null;
var datefin = null;
var admin = controller.get('admin');

//alert (dateInitialIE+ " - "+ dateFinalIE);
plantillas  =JSON.stringify(controller.get('plantillasGet'));
localStorage.setItem('plantillasLS', plantillas);

var estado  =JSON.stringify(controller.get('id_estado'));

if (admin){
  id_tipo_pago = controller.get('selectedTipoPago');

  if(this.get('isSelectedEstados')===true){
    id_estado = controller.get('selectedEstado');
  }
  else{
    id_estado = this.store.fetchById("estado",estado);
  }
  tramiteid = 1;
}
else {
  if(this.get('isSelectedDependencias')===true){
   dependency =  controller.get('selectedDependencia');
 }
 else{
   tramiteid = 2;
   //dependency = this.store.fetchById("dependency", dependencia_id);
   dependency =  controller.get('selectedDependencia');
   
 }
}
 //jQuery.isEmptyObject(objeto)
// console.log("id_tramite--->"+ id_tramite);
if (id_tramite === null || id_tramite === undefined){
//  console.log("tramiteid--->"+ tramiteid);

if (tramiteid === 1){
 tramite = controller.get('userTramite');
}else if (tramiteid === 2){
 tramite = controller.get('userTramite');
 
}
}else {
  tramite =id_tramite;

}
 if (explorer == 12){
   dateinicio = controller.get('startdate');
   datefin = controller.get('finaldate');

 }
 else {
  var diaInitial = controller.get('initialDia');
  var mesInitial = controller.get('initialMes');
  var anioInitial = controller.get('initialAnio');

  var fechaExplorer = JSON.stringify(anioInitial.description)+"-"+ JSON.stringify(mesInitial.description)+ "-"+ JSON.stringify(diaInitial.description);
  fechaExplorer = fechaExplorer.replace(/\"/g, "")
  dateinicio = fechaExplorer;

  var diaFinal = controller.get('finalDia');
  var mesFinal = controller.get('finalMes');
  var anioFinal = controller.get('finalAnio');

  var fechaExplorerFinal = JSON.stringify(anioFinal.description)+"-"+ JSON.stringify(mesFinal.description)+ "-"+ JSON.stringify(diaFinal.description);
  fechaExplorerFinal = fechaExplorerFinal.replace(/\"/g, "")
  datefin = fechaExplorerFinal;


} 

var sdate = null;
var fdate = null;

if (dateinicio !== ""  && dateinicio !== null && dateinicio !== undefined && datefin !== undefined && datefin !== "" && datefin !== null){

 sdate = new Date(dateinicio);
 fdate = new Date (datefin);

}
this.store.fetchById('user', this.get('id_usuario') ).then(function(user) {
  setTimeout(function () {

    var newFormulario = {
      "nombre": nombre,
      "usuario": user ,
      "estado":id_estado,
      "tramite":tramite,
      "pago":id_tipo_pago,
      "status": status,
      "dependencia": dependency,
      "fecha_inicio": sdate,
      "fecha_fin": fdate,
      "captcha": captcha
    };
// console.log("Dato del formulario ---_> "+ JSON.stringify(newFormulario));
var newRecord = controller.get('model').store.createRecord('formulario', newFormulario);
        newRecord.save().then(function(formulario){ //SUCCESS

          var idformulario = JSON.stringify(formulario.get('id'));
          controller.set('id_form', idformulario);
       //   var result =JSON.stringify(formulario);
         //alert(idformulario);

         if (idformulario !== 'null'){
          controller.set('newFormulario',formulario);
          controller.set('isSaved', true);
        }
        else {
          controller.set('txMessage','El formulario que intenta crear ya existe, favor de actualizarlo');
          controller.set('isSaved', false);
          controller.set('txEvent', true);
          setTimeout(function () {
            if(controller!==null) {
              controller.set('txEvent', false);
              controller.set('message', '');
            }
          },10000);
        }
      });
      });
},10000);
},
saveFormularioAtt: function(status) {

  var controller = this;
  var flag = false;
  var data =  localStorage.getItem('JsonForm');
  var att_name = "";
  var  obj = JSON.parse(data);
  var faltantes = 0;
  var faltaName = false;
  Ember.$.each(obj.atributos, function(i) {
    if (obj.atributos[i].type !== 'hr'){
      if (obj.atributos[i].name === undefined){
        faltantes +=  1;
        console.log('atributos--->>>');
        if (obj.atributos[i].type === 'header'){
          controller.set('txMessage',"Existe un elemento "+obj.atributos[i].element+" que no tienen un nombre asignado. Por favor asignelos. para continuar");
        }else  {
          controller.set('txMessage',"Existe un elemento "+obj.atributos[i].type+" que no tienen un nombre asignado. Por favor asignelos. para continuar");
        }
        controller.set('txEvent', true);
      }
      if (obj.atributos[i].type === 'button'){
       if (obj.atributos[i].urlbutton === undefined){
        faltantes +=  1;

        controller.set('txMessage',"Existe un elemento "+obj.atributos[i].type+" que no tiene asignado una url. Por favor asignelos. para continuar");
        controller.set('txEvent', true);
      }  
      if (obj.atributos[i].label === undefined){
        faltantes +=  1;

        controller.set('txMessage',"Existe un elemento "+obj.atributos[i].type+" que no tiene asignado una etiqueta. Por favor asignelos. para continuar");
        controller.set('txEvent', true);
      }
    }

  }
  if ( obj.atributos[i].name !== undefined){
    att_name += ","+ obj.atributos[i].name ;
  }
});
  var uniqueList=att_name.split(',').filter(function(allItems,i,a){
    return i===a.indexOf(allItems);
  }).join(',');

  if (uniqueList !== att_name){
   controller.set('txMessage','Existen campos con el mismo nombre  dentro del formulario');
   controller.set('txEvent', true);
   flag = true;
 }

 if (faltantes === 0){
  faltaName = false;
}
else {
  faltaName = true;
}

if(data!==null && data!== undefined && data !== "" && flag === false && faltaName === false){

  if(this.get('isSelectedEstados')===true){
    var  id_estado = controller.get('selectedEstado');
    controller.get('newFormulario').set('estado', id_estado);
  }
  var id_tramite = controller.get('selectedTramite');
  var id_tipo_pago = controller.get('selectedTipoPago');

  controller.get('newFormulario').set('tramite', id_tramite);
  controller.get('newFormulario').set('pago', id_tipo_pago);

  var atributos =JSON.parse(data);
  var bodyForm = {"id_formulario":this.get("newFormulario").get('id'), "status": status , "atributos": atributos.atributos};

  var parentController = controller.get('controllers.formas/index');
  Ember.$.ajax({
       //url: config.ENV.APP.REST_WSPREFIX + ENV.APP.REST_WSSUFIXFORM,
       url:  config.APP.REST_WSPREFIX+"/"+config.APP.WSSUFIX+'/atributos',
       type: 'POST',
       dataType: 'json',
       contentType: 'application/json',
       data: JSON.stringify(bodyForm)
     })
  .done(function() {
    if(controller.get('isUpdated')===true){

      var formUpdate = {"id":controller.get("newFormulario").get('id'), "status": status , "atributos": atributos.atributos, "formulario": controller.get("newFormulario")};
      Ember.$.ajax({
       url: config.APP.REST_WSPREFIX+config.APP.WSSUFIX+'formas/'+controller.get("newFormulario").get('id'),
       type: 'PUT',
       dataType: 'json',
       contentType: 'application/json',
       data: JSON.stringify(formUpdate)
     })
      .done(function() {

        controller.set('isUpdated',false);
        controller.set('isSaved', false);
        controller.set('selectedEstado', null);
        controller.set('selectedTramite', null);
        controller.set('selectedTipoPago', null);

        var parentController = controller.get('controllers.formas/index');
        controller.set('nameform', null);
        controller.set('startdate', null);
        controller.set('finaldate', null);
        controller.set('plantillas', null);
        parentController.set('txEvent',true);
        parentController.set('txMessage','Formulario Guardado');
        setTimeout(function () {
          if(parentController!==null) {
            parentController.set('txEvent', false);
            parentController.set('txMessage', '');
          }
        },2000);

        localStorage.setItem('JsonForm',"");
        controller.transitionToRoute('/formas');


      });

    }else{

      controller.set('isUpdated',false);
      controller.set('isSaved', false);
      controller.set('selectedEstado', null);
      controller.set('selectedTramite', null);
      controller.set('selectedTipoPago', null);
      controller.set('nameform', null);
      controller.set('startdate', null);
      controller.set('finaldate', null);
      controller.set('plantillas', null);
      parentController.set('txEvent',true);
      parentController.set('txMessage','Formulario Guardado');
      setTimeout(function () {
        if(parentController!==null) {
          parentController.set('txEvent', false);
          parentController.set('txMessage', '');
        }
      },2000);

      localStorage.setItem('JsonForm',"");
      controller.transitionToRoute('/formas');

    }

  })
  .fail(function() {

    parentController.set('txEvent',true);
    parentController.set('txMessage','Error al guardar formulario');
    setTimeout(function () {
      if(parentController!==null) {
        parentController.set('txEvent', false);
        parentController.set('txMessage', '');
      }
    },2000);

    localStorage.setItem('JsonForm',"");
    controller.transitionToRoute('/formas');

  });
}
else {
  setTimeout(function () {
    if(controller!==null) {
      controller.set('txEvent', false);
      controller.set('message', '');
    }
  },5000);
}
},
cancelyElim_Formulario: function() {
  var controller = this;
  this.set('isSaved', false);
  var fromId = Ember.$.trim(controller.get('id_form').replace(/"/g, ""));
// alert(fromId);
var parentController = this.get('controllers.formas/index');
Ember.$.ajax({
 url: config.APP.REST_WSPREFIX+config.APP.WSSUFIX+'formas/'+fromId,
 type: 'DELETE',
 dataType: 'json',
 async:false
}).done(function() {
});
parentController.set('txEvent',true);
parentController.set('txMessage','Formulario cancelado');
this.transitionToRoute('/formas');
setTimeout(function () {
  if(parentController!==null) {
    parentController.set('txEvent', false);
    parentController.set('txMessage', '');
  }
},2000);
this.set('isUpdated',false);
this.set('isSaved', false);
this.set('selectedEstado', null);
this.set('selectedTramite', null);
this.set('selectedTipoPago', null);
},
cancelFormulario: function() {


  this.set('isSaved', false);

  var parentController = this.get('controllers.formas/index');
  parentController.set('txEvent',true);
  parentController.set('txMessage','Formulario cancelado');
  setTimeout(function () {
    if(parentController!==null) {
      parentController.set('txEvent', false);
      parentController.set('txMessage', '');
    }
  },2000);
  this.transitionToRoute('/formas');

  this.set('isUpdated',false);
  this.set('isSaved', false);
  this.set('selectedEstado', null);
  this.set('selectedTramite', null);
  this.set('selectedTipoPago', null);

},
regresarFormulario: function() {
  this.transitionToRoute('/formas');
}
}
});
