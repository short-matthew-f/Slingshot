var Vector = function (x, y) {
  this.x = x;
  this.y = y;
};

Vector.add = function (vectorOne, vectorTwo) {
  var x = vectorOne.x + vectorTwo.x,
      y = vectorOne.y + vectorTwo.y;

  return new Vector(x, y);
};

Vector.subtract = function (vectorOne, vectorTwo) {
  var x = vectorOne.x - vectorTwo.x,
      y = vectorOne.y - vectorTwo.y;

  return new Vector(x, y);
};

Vector.distance = function (vectorOne, vectorTwo) {
  return Vector.subtract(vectorOne, vectorTwo).length();
};

Vector.prototype.clone = function () {
  return new Vector(this.x, this.y);
};

Vector.prototype.length = function () {
  return Math.sqrt(this.x * this.x + this.y * this.y);
};

Vector.prototype.lengthInt = function () {
  return Math.floor(this.length());
};

Vector.prototype.add = function (otherVector) {
  this.x += otherVector.x;
  this.y += otherVector.y;

  return this;
};

Vector.prototype.subtract = function (otherVector) {
  this.x -= otherVector.x;
  this.y -= otherVector.y;

  return this;
};

Vector.prototype.multiply = function (scalar) {
  this.x *= scalar;
  this.y *= scalar;

  return this;
}

Vector.prototype.normalize = function () {
  var length = this.length();

  if ( !(this.x == 0 && this.y == 0) ) {
    this.x /= length;
    this.y /= length;
  }

  return this;
};
