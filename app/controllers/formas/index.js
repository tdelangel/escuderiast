import Ember from 'ember';

export default Ember.Controller.extend({
  dateInitial: null,
  dateFinal: null,
  filter: '',
  filteredContent: function() {
  	console.log('sanchez');
    var localItem = JSON.parse(localStorage[config.APP.LS]);

    var role = localItem.json.role;
    //    alert('role --->'+ role);
    if (role === 'SA' || role === 'AD' || role === 'EAD' ){
      this.set('viewDelete', true);
    }else {
      this.set('viewDelete', false);
    }
    var filter = this.get('filter');
    var dateInitial = this.get('dateInitial');
    var dateFinal = this.get('dateFinal');
    var or = this.get('or');
    var rx = new RegExp(filter, 'gi');
    var nombreabuscar = new RegExp(namesSearch, 'gi');
    if(filterTramite !== null || filterTramite !== ''){
      var rxT = new RegExp(filterTramite, 'gi');
    }

    if(filterEstadoName!== null){
      var rxEI = new RegExp(filterEstadoId, 'i');
      var rxEN = new RegExp(filterEstadoName, 'gi');
    }
    if(filterDependencia!==null){
      var rxD = new RegExp(filterDependencia, 'i');
    }

    if(filterPago!=null){
      var rxP = new RegExp(filterPago._data.tipo_pago, 'gi');
    }
    if(filterStatus!== null || filterStatus !== ""){
      var rxS = new RegExp(filterStatus, 'gi');
    }
    var formas = this.get('model');

    if (namesSearch.length>0) {
      var response = true;
      return formas.filter(function(formulario) {
        // Busqueda por nombre de  formulario
        if (formulario._data.nombre !== null || formulario._data.nombre !== null) {
          response = formulario._data.nombre.match(nombreabuscar);
        } else {
          response = false;
        }
        return response;
      });
      // busqueda por  tramite
    }else if (filter.length>0) {
      return formas.filter(function(formulario) {
        if (formulario._data.n_estado !== undefined && formulario._data.n_estado !== null ) {
          return formulario._data.n_tramite.name.match(rx) || formulario._data.n_estado.estado.match(rx) || formulario._data.n_tipo_pago.tipo_pago.match(rx)  || formulario._data.nombre.match(rx);
        } else if (formulario._data.n_dependencia !== undefined && formulario._data.n_dependencia !== null ) {
          return formulario._data.n_tramite.name.match(rx) || formulario._data.n_dependencia.name.match(rx)  || formulario._data.nombre.match(rx);
        }

      });
    }else{ // busqueda por combo seleccionado

      if(filterTramite.length>0 || filterEstadoName!== null || filterPago!== null  || filterDependencia !== null && filterDependencia !== undefined   ){

        return formas.filter(function(formulario) {
          var response = true;

          if(filterTramite.length>0 && filterTramite !== undefined){
            if (formulario._data.n_tramite !== null && formulario._data.n_tramite !== undefined) {
              response = formulario._data.n_tramite.name.match(rxT);
            } else {
              response = false;
            }
            response = formulario._data.n_tramite.name.match(rxT);
          }

          if(filterEstadoName!= null && filterEstadoName !== undefined && response){
            //  console.log(rxE);
            if (formulario._data.n_estado !== null && formulario._data.n_estado !== undefined) {
              response = formulario._data.n_estado.id.toString().match(rxEI) && formulario._data.n_estado.estado.match(rxEN);
            } else {
              response = false;
            }
          }
          if(filterDependencia!= null && filterDependencia !== undefined && response){
            //  console.log(rxE);
            if (formulario._data.n_dependencia !== null && formulario._data.n_dependencia !== undefined) {
              response =  formulario._data.n_dependencia.name.match(rxD);
            }else {
              response = false;
            }
          }
          if(filterPago!= null && filterPago !== undefined && response){
            if (formulario._data.n_tipo_pago !==null && formulario._data.n_tipo_pago !==undefined){
              response = formulario._data.n_tipo_pago.tipo_pago.match(rxP);
            }else {
              response = false;
            }

          }
          return response;

        });
        /* Filtrado por estatus*/
      } else if(filterStatus.length>0 || filterStatus!== null || filterStatus!== ""){
        // console.log("filter estatus search---_> "+filterStatus);
        return formas.filter(function(formulario) {

          var response = true;

          if(filterStatus!= null && filterStatus !== undefined && filterStatus !== "" && response){

            if (filterStatus !== 0 ){
              if (changeView === true){
                response = formulario._data.status.match(rxS);
              }
            }

          }
          //
          return response;

        });

      }else{

        return formas.filter(function(formulario){
          if(formulario._data.id!==undefined){
            return true;
          }else{
            return false;
          }
        });

      }

    }

  }.property('content','model', 'filter','dateInitial','dateFinal', 'model.@each'),

  actions: {

    goToPreview: function(params) {
      this.transitionToRoute('/formas/show/' + params.id);
      this.set('changeView', true);
    },
    goToFormulario: function(params) {
      this.set('filterStatus', '');
      this.set('changeView', true);
      // alert (params.id);
      this.transitionToRoute('/formas/edit/' + params.id);
    }, 
    goToPuntos: function(params) {
      
      this.transitionToRoute('/formas/puntos/' + params.id);
    },
    goToReports: function() {
     this.transitionToRoute('/formas/reports' );
   },

   createNewFormulario: function() {
    this.set('filterStatus', '');
    this.set('changeView', false);
    this.transitionToRoute('/formas/new');
  },
  displayAdvSearch : function(){
    Ember.$('.adv-search').toggleClass('invisible');
    this.set('selectedTipoPago', null);
    this.set('selectedEstado', null);
    this.set('tramiteSearch', '');
    this.set('namesSearch', '');
    this.set('status', '');
    this.set('changeView', true);
    Ember.$(".navStatus").removeClass("active");
    Ember.$("#status-" + 0).addClass("active");
  },
  clearSearch : function(){
   
    this.set('selectedTipoPago', null);
    this.set('selectedEstado', null);
    this.set('tramiteSearch', '');
    this.set('namesSearch', '');
    this.set('status', '');
    this.set('changeView', true);
    Ember.$(".navStatus").removeClass("active");
    Ember.$("#status-" + 0).addClass("active");
  },
  deleteFormulario:function(params){
   var controller = this;
   var value = "["+ JSON.stringify(params) +"]";

   value = JSON.parse(value);
//   console.log(value);
this.set('changeView', false);
Ember.$.prompt("¿Esta seguro de eliminar el formulario? " + "<b>"+ value[0].nombre+ "</b>" , {
  overlayspeed:'fast',
  promptspeed:'fast',
  title: "Formulario",
  buttons: { "Eliminar": true, "Cancelar": false },
  submit: function(e,answer){
    if(answer === true){

      var itemSelected = params;
      itemSelected.destroyRecord();

      controller.set('txEvent',true);
      controller.set('txMessage','Eliminación Exitosa');

      setTimeout(function () {
        controller.set('txEvent',false);
        controller.set('txMessage','');
        Ember.$(".navStatus").removeClass("active");
        Ember.$("#status-" + 0).addClass("active");
      },3000);


    }
  }
});
}, 
unLock:function(params, id){

  var transicion  =  this;

  var value = "["+ JSON.stringify(params) +"]";

  value = JSON.parse(value);

  var status = value[0].lock;

  var msg =   "";
  var msgfinal =   "";
  var activar = false;
  var botones = {};
  var lock = "";
  var class_ = "";

  var name = "<b>"+ value[0].nombre+ "</b>";
  
  botones =  { "Activar": true , "Cancelar": false };
  activar = true;
  if (status === "true"){
    lock  =false;
    class_ = "style='color:red;'";  

    msg = "¿Está seguro de querer desbloquear el formulario? <br> "+ name+ "<br><i> Esta opción se utiliza cuando un error inesperado cerró el sistema y no pudo ser resuelto en su momento</i>";    
    msgfinal = 'El formulario fue desbloqueado';
  }else{
    msg = "¿Está seguro de querer bloquear el formulario? <br> "+ name+ "<br><i> Esta opción se utiliza para que un usuario no pueda editar el formulario después de creado</i>";
    lock =true;
    msgfinal = 'El formulario fue bloqueado';


  } 

  Ember.$.prompt(msg , {
    overlayspeed:'fast',
    promptspeed:'fast',
    title: "Formulario",
    buttons:botones,
    submit: function(e,answer){
      if(answer === true){

       var bodyForm = {"id":id, "lock": lock};
       Ember.$.ajax({
         //  url: config.ENV.APP.REST_WSPREFIX + ENV.APP.REST_WSSUFIXFORM,
         url: config.APP.REST_WSPREFIX+"/"+config.APP.WSSUFIX+'/locks/'+id,
         type: 'PUT',
         dataType: 'json',
         contentType: 'application/json',
         data: JSON.stringify(bodyForm)
       })
       .done(function(result) {
        msgfinal = JSON.stringify(result.resultado);
        botones =  {  "Aceptar": true };
        Ember.$.prompt(msgfinal , {
          overlayspeed:'fast',
          promptspeed:'fast',
          title: "Formulario",
          buttons:botones,
          submit: function(e,answer){
            if(answer === true){
              if (lock === false){
               Ember.$(".fa.fa-lock."+id).css("color", "#008000"); 
             }else {
              Ember.$(".fa.fa-lock."+id).css("color", "#FF0000"); 
            }
            transicion.transitionToRoute('/formas');
          }
        }
      });
      });
     }
   }
 });
},
activeFormulario:function(params){
 var value = "["+ JSON.stringify(params) +"]";

 value = JSON.parse(value);
 var status = value[0].status;
 var id = value[0].id;
 var msg =   "";
 var estatusNew  = "";
 var activar = false;
 var botones = {};
 var name = "<b>"+ value[0].nombre+ "</b>";
 if (status ==="1"){
  activar = false;
  botones =  {"Aceptar": false };
  msg = "No se puede publicar el formulario. <br>"+ name +".<br>está incompleto o no cuenta con campos para mostrar.";
  value[0].status = 1; 
}
else if (status === "2"){
  activar = true;
  botones =  { "Publicar": activar , "Cancelar": false };
  msg = "¿Éstá seguro de querer publicar el formulario? <br> "+ name;
  value[0].status = 3;
  estatusNew = "Publicado";
}
else if (status === "3"){
  activar = true;
  botones =  { "Publicar": activar , "Cancelar": false };
  msg = "El formulario <br>"+ name +".<br>está publicado  ¿Desea actualizar la publicacion?";
  value[0].status = 3; 
  estatusNew = "Republicado";
} 

this.set('changeView', false);
Ember.$.prompt(msg , {
  overlayspeed:'fast',
  promptspeed:'fast',
  title: "Formulario",
  buttons:botones,
  submit: function(e,answer){
   id = params.id;

   if(answer === true){
    var itemSelected = '{ "id":'+id+',  "formulario": {"tramite":'+params._data.n_tramite.id+', "dependencia":'+params._data.n_dependencia.id+'} }';
    itemSelected = JSON.parse(itemSelected);
    Ember.$("#"+id).removeClass('fa-check-square');
    Ember.$("#"+id).addClass('fa-check-square-o ');
    Ember.$("#"+id).css("color", "#4D92DF");

    Ember.$.ajax({
         //  url: config.ENV.APP.REST_WSPREFIX + ENV.APP.REST_WSSUFIXFORM,
         url: config.APP.REST_WSPREFIX+"/"+config.APP.WSSUFIX+'/publicaciones/'+id,
         type: 'PUT',
         dataType: 'json',
         contentType: 'application/json',
         data:  JSON.stringify(itemSelected) 
       })
    .done(function() {
      Ember.$(".estatus-form"+"."+id).text(estatusNew);

    });

  }
}
});
},
changeStatus: function(status){

  Ember.$(".navStatus").removeClass("active");
  Ember.$("#status-" + status).addClass("active");
  this.set('status', status);
  this.set('changeView', true);
  return false;
},
advancedSearch: function(){
}
}
});
