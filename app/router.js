import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,

});


Router.map(function() {
  this.route('login');
  this.route('home');
   this.resource('formas', function() {
      this.route('new');
      this.route('show', { path: '/show/:id_forma' });
      this.route('edit', { path: '/edit/:id_forma' });
      this.route('puntos', { path: '/puntos/:id_forma' });
    });
    this.route('users', function() {
    });


});

export default Router;
