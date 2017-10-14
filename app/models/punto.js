import DS from 'ember-data';
export default DS.Model.extend({
    id_cat_puntos_inspeccion: DS.attr('String'),
    cat_puntos_desc: DS.attr('String'),
    tipo: DS.attr('String'),
    nombre: DS.attr('String'),
    id_forma: DS.attr('String'),
    url_video: DS.attr('String'),
    url_imagen: DS.attr('String')
});
