// var BLUESHIFT_APP_ID = 'eaa6ba7302f37a8ff8b1a289f727c26f';
var BLUESHIFT_APP_ID = "7109c112a1b2531170f676e052cff42a";

window._blueshiftid = BLUESHIFT_APP_ID;
window.blueshift = window.blueshift || [];
if (blueshift.constructor === Array) {
	blueshift.load = function() {
		var d = function(a) {
				return function() {
					blueshift.push(
						[a].concat(Array.prototype.slice.call(arguments, 0))
					);
				};
			},
			e = [
				"identify",
				"track",
				"click",
				"pageload",
				"capture",
				"retarget"
			];
		for (var f = 0; f < e.length; f++) 
			console.log(e[f], d(e[f]))
			blueshift[e[f]] = d(e[f]);
	};
}
blueshift.load();
blueshift.pageload();
if (blueshift.constructor === Array) {
	(function() {
		var b = document.createElement("script");
		(b.type = "text/javascript"),
			(b.async = !0),
			(b.src =
				("https:" === document.location.protocol ? "https:" : "http:") +
				"//cdn.getblueshift.com/blueshift.js");
		var c = document.getElementsByTagName("script")[0];
		c.parentNode.insertBefore(b, c);
	})();
}
