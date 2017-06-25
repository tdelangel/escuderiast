import Ember from 'ember';
import JSONAPIAdapter from 'ember-data/adapters/json-api';
import config from '../config/environment';

const { String: { pluralize, underscore } } = Ember;

export default DS.JSONAPIAdapter.extend({
    host:  config.APP.REST_WSPREFIX+'/'+ config.APP.WSSUFIX
});