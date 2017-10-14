import DS from 'ember-data';
export default DS.Model.extend({
  nombre: DS.attr('string'),
  apaterno: DS.attr('string'),
  amaterno: DS.attr('string'),
  email: DS.attr('string'),
  user_cel: DS.attr('string'),
  user_tel: DS.attr('string'),
  puesto: DS.attr('string'),
  username: DS.attr('string'),
  password: DS.attr('string'),
  role: DS.attr('string')

});
