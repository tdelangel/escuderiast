import { test } from 'qunit';
import moduleForAcceptance from 'escuderiast/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | list formas');

test('visiting /list-formas', function(assert) {
  visit('/list-formas');

  andThen(function() {
    assert.equal(currentURL(), '/list-formas');
  });
});
