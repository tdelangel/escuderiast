import DS from 'ember-data';

export default DS.Model.extend({
	idcat_autos: DS.attr('string'),
	cat_autos_placas: DS.attr('string'),
	cat_autos_notas: DS.attr('string'),
	cat_autos_anio: DS.attr('string')
});
