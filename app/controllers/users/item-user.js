/*global $:false */
import Ember from 'ember';

import config from '../../config/environment';

export default Ember.ObjectController.extend({
  needs: ['users/index'],
  isEditingUser:false,
  isChecked: false,
  isEdited: false,
  selectedUserRol:null,
  deleteUserConfirm:false,
  flagTipo: false,
  hasForms: false,
  deleteActive: false,
  watchRole: function() {
    var selection = this.get('selectedUserRol');
    if (selection) {
      this.get('model').set('role', selection.text);
    }
  }.observes('selectedUserRol'),
  watchEstado: function() {
    var selection = this.get('selectedUserEstado');
   
    if (selection) {
      if(selection.estado===undefined){
        this.get('model').set("estado_id",selection);
      }
      this.get("model").get("estado_id").set("id", selection.id);  
    }else{
      this.get('model').set("estado_id",null);
    }

  }.observes('selectedUserEstado'), 
  watchValidation: function() {
    var re =  /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm;
   
    // Se verifica que tipo de usuario viene para activar el combo de dependencias o de estados

    var rolSeleccionado = JSON.stringify(this.get('selectedUserRol.text'));
    rolSeleccionado = rolSeleccionado.replace(/"/g, "");

  
   /*Validacion de campos*/
 var name = false;
 var correo = false;
 var rol = false;
 var estado = false;
var dependencia = false;

  name = (this.get('name')!==null && this.get('name').trim() !== '');
  correo =  (this.get('email')!==null && this.get('email').trim() !== '') ||  !re.test(this.get('email').trim());
  rol =(this.get('selectedUserRol')!==null )||  (this.get('selectedUserRol')!==undefined );
    if (rolSeleccionado === "EAD" || rolSeleccionado === "EED"){
     this.set('flagTipo', false);
     dependencia =(this.get('selectedUserDependencia')!==null )&&  (this.get('selectedUserDependencia')!==undefined );
     estado = true;
   }else if (rolSeleccionado === "AD" || rolSeleccionado === "ED"){
     this.set('flagTipo', true);
        estado =(this.get('selectedUserEstado')!==null )&&  (this.get('selectedUserEstado')!==undefined );
        dependencia = true;
   }
   if (name && correo && rol && estado  && dependencia){
 //console.log (" abierto o cerrado--->"+enableSave);
 this.set('isEdited', false);
}else {
   this.set('isEdited', true);
}
}.observes('name','email','selectedUserRol','selectedUserEstado', 'selectedUserDependencia'),
userValidation : function(){

  if(this.get('deleteActive')===true){

    var controller = this;

    

    var id_usuario = {id_usuario:this.get('model').get("id")};


    this.store.fetchById('formulario', id_usuario).then(function(formas) {
      if(formas.toArray().length>0){
        $.prompt("El usuario tiene formas asignados, ¿Deseas continuar?", {
          overlayspeed:'fast',
          promptspeed:'fast',
          title: "Usuario",
          buttons: { "Continuar": true, "Cancelar": false },
          submit: function(e,answer){
            if(answer){
              controller.set('deleteUserConfirm',true);
            }else{
              controller.set('deleteActive',false);
              controller.set('deleteUserConfirm',false);
              controller.set('hasForms',false);
            }
          }
        });
      } else {
        controller.set('deleteUserConfirm',true);
      }
      
    });   


  } 

}.observes('hasForms'),

deleteUser : function(){

  if(this.get('deleteActive')===true){
    var controller = this;
    var parentController = this.get('parentController');

    var id_usuario = {id_usuario:this.get('model').get("id")};

    Ember.$.ajax({
     url: config.APP.REST_WSPREFIX +"/"+ config.APP.WSSUFIX+'/formas',
     type: 'DELETE',
     dataType: 'json',
     contentType: 'application/json',
     data: JSON.stringify(id_usuario)
   })
    .done(function() {  


      var record = controller.get('model');
      record.destroyRecord();
      
      controller.set('deleteActive',false);
      controller.set('deleteUserConfirm',false);
      controller.set('hasForms',false);
      controller.set('isEditingUser', false);
      
      parentController.set('userEvent',true);
      parentController.set('userMessage','Eliminación Exitosa');
      
      setTimeout(function () {

        parentController.set('userEvent',false);      
        parentController.set('userMessage','');

      },3000);


    })
    .fail(function() {
      parentController.set('userEvent',true);
      parentController.set('userMessage','Error al eliminar');
      setTimeout(function () {
        parentController.set('userEvent',false);   
        parentController.set('userMessage','');
      },3000);
    });


  }
}.observes('deleteUserConfirm'),

actions: {
  editUserAction:function(){

    var parentController = this.get('parentController');
    var rolSelected = {text:"",description:""};
    for (var i = 0; i < parentController.get('rolItems').length; i++) {
      if (parentController.get('rolItems')[i].text === this.get('model').get('role')){
        rolSelected.text = parentController.get('rolItems')[i].text ;
        rolSelected.description = parentController.get('rolItems')[i].description; 
      }
    }

    this.set('selectedUserRol',{text:rolSelected.text, description:rolSelected.description});
   // console.log('rool edit -->' + rolSelected);
    //console.log('Dependencia edit -->' + this.get('model').get('dependencia_id').get('id'));
       if(this.get('model').get('estado_id').get('id')!== undefined &&  (rolSelected.text === "AD" || rolSelected.text === "ED")){
        this.set('selectedUserEstado',{id:this.get('model').get('estado_id').get('id'), estado:this.get('model').get('estado_id').get('estado')});
        this.set('flagTipo', true);
      }
     else if(this.get('model').get('dependencia_id').get('id')!== undefined ){
      this.set('selectedUserDependencia',{id:this.get('model').get('dependencia_id').get('id'), 
        name:this.get('model').get('dependencia_id').get('name')});
    
      this.set('flagTipo', false);
    }
    
      this.set('isEditingUser', true);
  },
  deleteUserAction:function(){

    var controller = this;

    controller.set('deleteActive', true);

    $.prompt("¿Eliminar usuario?", {
      overlayspeed:'fast',
      promptspeed:'fast',
      title: "Usuario",
      buttons: { "Eliminar": true, "Cancelar": false },
      submit: function(e,answer){
        if(answer){
          controller.set('hasForms',true);
        }else{
          controller.set('deleteActive',false);
          controller.set('deleteUserConfirm',false);
          controller.set('hasForms',false);
        }
      }
    });
  },
  cancelUserAction:function(){
    this.get('model').rollback();
    this.set('isEditingUser', false);
  },
  saveUserAction:function(){
    var controller = this;
    var parentController = this.get('parentController');
    var user = controller.get('model');
    user.save().then(function(){
      controller.set('isEditingUser',false);
      parentController.set('userEvent',true);
      parentController.set('userMessage','Modificación Exitosa');
      setTimeout(function () {
        parentController.set('userEvent',false);
        parentController.set('userMessage','');
      },3000);
      },function (result){ //ERROR
        console.log(result);
        parentController.set('userEvent',true);
        parentController.set('userMessage','Error al modificar');
        setTimeout(function () {
          parentController.set('userEvent',false);   
          parentController.set('userMessage','');
        },3000);
      });
  }
}
});
