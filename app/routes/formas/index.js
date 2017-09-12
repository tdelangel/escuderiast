import Ember from 'ember';

export default Ember.Route.extend({
  model() {
let formas = this.store.findAll('forma');
    return formas;

}
});