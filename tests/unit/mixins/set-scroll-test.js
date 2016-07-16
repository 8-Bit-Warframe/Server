import Ember from 'ember';
import SetScrollMixin from 'lost-sector-website/mixins/set-scroll';
import { module, test } from 'qunit';

module('Unit | Mixin | set scroll');

// Replace this with your real tests.
test('it works', function(assert) {
  let SetScrollObject = Ember.Object.extend(SetScrollMixin);
  let subject = SetScrollObject.create();
  assert.ok(subject);
});
