export default DS.Model.extend({
  idcat_autos: DS.attr('String'),
  anio: DS.attr('String'),
  formas: DS.hasMany('forma',{ async: true})
});
