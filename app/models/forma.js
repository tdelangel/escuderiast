import DS from 'ember-data';

export default DS.Model.extend({
	estatus_inspeccion: DS.attr('string'),
	notas_inspeccion: DS.attr('string'),
	fecha_actualizacion: DS.attr('string'),
	idcat_puntos_inspeccion: DS.attr('string'),
	urgentes_count: DS.attr('string'),
	sugeridos_count: DS.attr('string'),
	sinreparacion_count: DS.attr('string'),
	 tipo_auto: DS.belongsTo('auto',{ async: true, inverse: 'formas'}),
});
