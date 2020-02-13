const Vect2D = function(x, y) {
  this.x = x;
  this.y = y;
}

Vect2D.prototype = {
  constructor: Vect2D,
  add: function(vect2D) {
    return new Vect2D(this.x + vect2D.x, this.y + vect2D.y);
  },
  subtract: function(vect2D) {
    return new Vect2D(this.x - vect2D.x, this.y - vect2D.y);
  },
  divide: function(scalar) {
    return new Vect2D(this.x / scalar, this.y / scalar);
  },
  multiply: function(scalar) {
    return new Vect2D(this.x * scalar, this.y * scalar);
  },
  rotate: function(angle) {
    return new Vect2D(
      this.x * Math.cos(angle) - this.y * Math.sin(angle),
      this.x * Math.sin(angle) + this.y * Math.cos(angle)
    )
  },
  equals: function(vect2D) {
    return this.x === vect2D.x && this.y === vect2D.y;
  },
  magnitude: function() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }
}

export default Vect2D;

