   import Ember from 'ember';

   export default Ember.Controller.extend({
   	actions:{
         goToFormas: function() {
         	console.log('formas-de-inspeccion');
            this.transitionToRoute('/formas-de-inspeccion');
         }
      }
   });
