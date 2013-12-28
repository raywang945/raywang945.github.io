//Array.prototype.max = function() { return Math.max.apply(null, this); }
//Array.prototype.min = function() { return Math.min.apply(null, this); }
jQuery.fn.insertAt = function(index, element) {
	var lastIndex = this.children().size();
	if (index < 0) index = Math.max(0, lastIndex + 1 + index);
	this.append(element);
	if (index < lastIndex) this.children().eq(index).before(this.children().last());
	return this;
}

function getUrlGetByName(name) {
	name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"), results = regex.exec(location.search);
	return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function myClone(obj) {
	return JSON.parse(JSON.stringify(obj));
}
