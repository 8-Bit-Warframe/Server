import Ember from 'ember';

export default Ember.Component.extend({
	tagName: '',
	didInsertElement: function () {
		var twitter = document.createElement("script");
		twitter.src = "//platform.twitter.com/widgets.js";
		twitter.charset = "utf-8";
		twitter.async = true;
		document.getElementById("twitter").appendChild(twitter);
	}
});
