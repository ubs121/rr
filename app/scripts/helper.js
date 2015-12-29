function formatDate(d) {
  // getMonth starts from 0
  return [d.getFullYear(), d.getMonth() + 1, d.getDate()].map(function(n){
    return n.toString().rjust(2, '0');
  }).join('-');
}

String.prototype.rjust = function(width, padding) {
  padding = (padding || " ").substr(0, 1); // one and only one char
  return padding.repeat(width - this.length) + this;
}

String.prototype.repeat = function(num) {
  return (num <= 0) ? "" : this + this.repeat(num - 1);
}
