/*global $:false */
import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['newUserEnabled'],
  isSendingEmail:false,
  onNewUserError:null,
   rolItems:[{id:1, text:'AD',description:'Administrador Actas de Nacimiento'},{id:2,text:'ED',description:'Editor Actas de Nacimiento'},
  {id:3, text:'EAD',description:'Administrador Encuestas'},{id:4,text:'EED',description:'Editor Encuestas'},{id:5,text:'SA',description:'Super Administrador'}],  
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
    var validaDependenciaestado = false;
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



  //  console.log("role --->"+JSON.stringify (newUser.role));
   if (newUser.role !== null && newUser.role !== undefined){
     roltype =  newUser.role.text;
  }else {
     roltype = {};
  }
    
    if (roltype ==='SA') {

      hasAllProperties = newUser.hasOwnProperty('name') &&
      newUser.hasOwnProperty('username') &&
      newUser.hasOwnProperty('role') &&
      newUser.hasOwnProperty('email');

      hasValidData =  hasAllProperties &&
      newUser.name.trim() !== '' &&
      newUser.username.trim() !== '' &&
      newUser.role !== '' &&
      newUser.email.trim() === newUser.emailConfirm.trim()  &&
      newUser.email.trim() === newUser.emailConfirm.trim() &&
      re.test(newUser.email.trim());
      
    } 
    else {
      //rol view para ver el combo de estados o dependencias
      if (rolView){

       if (rolActive){
     // verifica cual esta activo
        validaDependenciaestado = newUser.estado_id !== '' &&
        newUser.estado_id !== null && newUser.estado_id !== undefined;

      //  console.log ("Es estado  ---_> "+ newUser.estado_id);
      
      } else {
        validaDependenciaestado = newUser.dependencia !== '' &&
        newUser.dependencia !== null && newUser.dependencia !== undefined;
     
       // console.log ("Es dependencia--> "+newUser.dependencia);
      }
    }


hasAllProperties = newUser.hasOwnProperty('name') &&
newUser.hasOwnProperty('username') &&
newUser.hasOwnProperty('role') &&
newUser.hasOwnProperty('email');

hasValidData = validaDependenciaestado && hasAllProperties &&
newUser.name.trim() !== '' &&
newUser.username.trim() !== '' &&
newUser.role !== '' &&
newUser.role !== null &&
newUser.email.trim() === newUser.emailConfirm.trim() &&

re.test(newUser.email.trim());
}
//console.log('validando  --->'+ hasValidData);
if(hasValidData){
  $('#addUser').removeClass('disabled');
} else {
  $('#addUser').addClass('disabled');
}
}.observes('newUserInstance.name','newUserInstance.username','newUserInstance.email','newUserInstance.emailConfirm','newUserInstance.role', 'newUserInstance.estado_id', 'newUserInstance.dependencia'),

actions:{
  newUserEventEnable: function(){
    this.set('newUserInstance',{name:'', username:'', email:'', emailConfirm:'', role:'', actve:'',estado_id:'',dependencia_id:''});
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
    //      console.log("Datos de  usuario---->"+JSON.stringify(newUser));
    var nombre = newUser.name;
    var usuario = newUser.username;
    var estado  = 0;
    var dependencia  = 0;
    usuario  = usuario.replace(/[^ a-zA-Z 0-9.]+/g,'');
    nombre = nombre.replace(/[^ áéíóúÁÉÍÓÚñÑ a-zA-Z 0-9.]+/g,'');
    var rolActive = this.get('rolActive');
    var rolView = this.get('rolView');

    if (rolView){
     if (rolActive){
       estado = newUser.estado_id;
 //  console.log ("Es estado  ---_> "+JSON.stringify(estado));
} else {
 dependencia  = newUser.dependencia;
// console.log ("Es dependencia--> "+JSON.stringify(dependencia));
}
}

var userItem = {
  name:nombre,
  username:usuario,
        //encrypted_password: 'tramitesgob',
        password: 'tramitesgob',
        email:newUser.email,
        role:newUser.role.text,
        estado_id: estado,
        dependencia_id: dependencia
        //active: true
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
