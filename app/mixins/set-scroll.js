import Ember from 'ember';

export default Ember.Mixin.create({
	activate: function () {
		this._super();
		$('html, body').animate({
			scrollTop: window.innerHeight - $("#tabs").height()
		}, 1000);
	}
});