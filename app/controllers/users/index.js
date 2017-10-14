/*global $:false */
import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['newUserEnabled'],
  isSendingEmail:false,
  onNewUserError:null,
  newUserEnabled:false,
  isComplete: false,
  newUserInstance:{},
  user:{},
  groupActions: ['Editar','Eliminar'],
  selectedAction: '',
  filter: '',
  getRol: '', 
  rolActive: false,
  rolView: false,
   cities: ['Usuario Administrador', 'Usuario Dependiente', 'Cliente', 'Cliente VIP'],
  destination: 'Cliente',
  filteredContent: function() {
    var filter = this.get('filter');
    var getRol = this.get('newUserInstance.role.text');
    if(getRol === undefined){
      getRol = this.get('user.selectedUserRol.text');
    }
    if (getRol === 'ED' || getRol === 'AD'){
    /**
      RolActive controla si se muestra estado o dependencia dependiendo del tipo de usuario 
      RolView para que el combo se vea o no
      */
      this.set('rolActive',true);
      this.set('rolView',true);
      
    }
    else if (getRol === 'EED' || getRol === 'EAD'){
      this.set('rolActive',false);
      this.set('rolView',true);
    }
    else{this.set('rolView',false);} 
    

    var rx = new RegExp(filter, 'gi');
    var usuarios = this.get('content');
    //console.log('usuarios ---> ' + this.get('content'));
    return usuarios.filter(function(usuario) {
      return usuario.get('name').match(rx) || usuario.get('username').match(rx) || usuario.get('email').match(rx) || usuario.get('role').match(rx);
    });
  }.property('user.selectedUserRol','newUserInstance.role','content', 'filter', 'content.@each'),
  watchNewUserForm: function() {

    var newUser = this.get('newUserInstance');
    var rolActive = this.get('rolActive');
    var rolView = this.get('rolView');
    var roltype = null;
    var re =  /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm;
    var hasAllProperties = false;
   // var valueDepOrEdo = false;
    var hasValidData = false;
   
  


      hasAllProperties = newUser.hasOwnProperty('name') &&
      newUser.hasOwnProperty('username') &&
      newUser.hasOwnProperty('password') &&
      newUser.hasOwnProperty('email');

      hasValidData =  hasAllProperties &&
      newUser.name.trim() !== '' &&
      newUser.username.trim() !== '' &&
      newUser.email.trim() === newUser.emailConfirm.trim()  &&
      newUser.email.trim() === newUser.emailConfirm.trim() &&
      re.test(newUser.email.trim());




//console.log('validando  --->'+ hasValidData);
if(hasValidData){
  $('#addUser').removeClass('disabled');
} else {
  $('#addUser').addClass('disabled');
}
}.observes('newUserInstance.name','newUserInstance.username','newUserInstance.email','newUserInstance.emailConfirm','newUserInstance.password'),

actions:{
   chooseDestination(city) {
      this.set('destination', city);
    },  
  newUserEventEnable: function(){
    this.set('newUserInstance',{name:'', username:'', email:'', emailConfirm:'', amaterno:'',apaterno:'',password:''});
    this.set('newUserEnabled',true);
    this.set('onNewUserError',null);
    this.set('isSendingEmail',false);
  },
  newUserEventDisable: function(){
    if (confirm('Estas seguro que deseas cancelar?')) {
      this.set('onNewUserError',null);
      this.set('newUserEnabled',false);
      this.set('newUserInstance',{});
      this.set('isSendingEmail',false);
    }
  }, selectedRol: function(){
    if (confirm('Estas seguro que deseas cancelar?')) {
      this.set('onNewUserError',null);
      this.set('newUserEnabled',false);
      this.set('newUserInstance',{});
      this.set('isSendingEmail',false);
    }
  },
  saveUser: function(){
    var newUser = this.get('newUserInstance');
        console.log("Datos de  usuario---->"+JSON.stringify(newUser));
    var nombre = newUser.name;
    var usuario = newUser.username;
    usuario  = usuario.replace(/[^ a-zA-Z 0-9.]+/g,'');
    nombre = nombre.replace(/[^ áéíóúÁÉÍÓÚñÑ a-zA-Z 0-9.]+/g,'');
  

  

var userItem = {
  nombre:nombre,
  username:usuario,
  role:2,
apaterno:newUser.apaterno,
amaterno:newUser.amaterno,
user_tel:newUser.user_tel,
 password:newUser.password,
 user_cel:newUser.user_cel,
 puesto: newUser.puesto,
     
      };
      var controller=this;
      var newRecord = this.store.createRecord('user', userItem);
      controller.set('isSendingEmail',true);
      newRecord.save().then(function(){ //SUCCESS
        controller.set('onNewUserError',null);
        controller.set('newCategoryItem',null);
        controller.set('newUserEnabled',false);
        controller.send("viewChanged");
        setTimeout(function () { 
          controller.set('isSendingEmail',false); 
        }, 3000);
      }, function (result){ //ERROR
        controller.set('onNewUserError', result.errors.error);
        setTimeout(function () { controller.set('onNewUserError', false); }, 3000);
        newRecord.rollback();
        newRecord.unloadRecord();
        controller.set('isSendingEmail',false);
        controller.send("viewChanged");
      });
    }
  }
});
