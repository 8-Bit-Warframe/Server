import Ember from 'ember';

export default Ember.Mixin.create({
	activate: function () {
		this._super();
		Ember.$('html, body').animate({
			scrollTop: window.innerHeight - Ember.$("#tabs").height()
		}, 1000);
	}
});