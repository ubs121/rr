function ByRating(a, b) {
	if (a.rating < b.rating) {
	  return -1;
	}
	if (a.rating > b.rating) {
	  return 1;
	}
	return 0;
}

function ByName(a, b) {
	if (a.name < b.name) {
	  return -1;
	}
	if (a.name > b.name) {
	  return 1;
	}
	return 0;
}

function ByPrice(a, b) {
	if (a.price < b.price) {
	  return -1;
	}
	if (a.price > b.price) {
	  return 1;
	}
	return 0;
}

function arrContains(a, b) {
	if (a.constructor === Array) {
		var a = a.map(Function.prototype.call, String.prototype.toLowerCase);
		return (a.indexOf(b.toLowerCase()) >= 0);
	}

	return false;
}


String.prototype.rjust = function(width, padding) {
  padding = (padding || " ").substr(0, 1); // one and only one char
  return padding.repeat(width - this.length) + this;
}

String.prototype.repeat = function(num) {
  return (num <= 0) ? "" : this + this.repeat(num - 1);
}

function fullUrl(url) {
	if (!url) {
	  return "";
	}

	console.log("url", url);

	if (url.startsWith("http")) {
	  return url;
	}

	if (!url.startsWith("www")) {
	  url = "www." + url;
	}

	return "http://" + url;
}

function formatDate(d) {
  // getMonth starts from 0
  return [d.getFullYear(), d.getMonth() + 1, d.getDate()].map(function(n){
    return n.toString().rjust(2, '0');
  }).join('-');
}