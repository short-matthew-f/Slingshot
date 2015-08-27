var GRAVITY_EXPONENT    = 1.5,
    GRAVITY_CORRECTION  = 2,
    MINIMUM_DISTANCE    = 0.667;

var Body = function (opts) {
  this.position     = opts.position     || new Vector(0, 0);
  this.velocity     = opts.velocity     || new Vector(0, 0);
  this.acceleration = opts.acceleration || new Vector(0, 0);

  this.view         = new BodyView(this);
};

Body.prototype.pin = function () { this.isFree = false; }
Body.prototype.release = function () { this.isFree = true; }

Body.prototype.clone = function () {
  var _body = new this.constructor({
    mass:         this.mass,
    position:     this.position.clone(),
    velocity:     this.velocity.clone(),
    acceleration: this.acceleration.clone()
  });

  return _body;
};

Body.prototype.gravityFrom = function (otherBody) {
  var direction = Vector.subtract(otherBody.position, this.position),
      distance  = Vector.distance(this.position, otherBody.position),
      radius    = Math.max(MINIMUM_DISTANCE, distance),
      gravity   = otherBody.mass / Math.pow(radius, GRAVITY_EXPONENT);

  return direction.normalize().multiply(gravity / GRAVITY_CORRECTION);
};

// SHIP

var Ship = function Ship (opts) {
  this.mass   = 1;
  this.type   = 'ship';
  this.isFree = true;

  Body.call(this, opts);
};

Ship.prototype = Object.create(Body.prototype);
Ship.prototype.constructor = Ship;

// PLANET

var Planet = function Planet (opts) {
  this.mass   = 2.0;
  this.type   = 'planet';
  this.isFree = false;

  Body.call(this, opts);
};

Planet.prototype = Object.create(Body.prototype);
Planet.prototype.constructor = Planet;

// ANOMALY

var Anomaly = function Anomaly (opts) {
  this.mass   = 1.0;
  this.type   = 'anomaly';
  this.isFree = false;

  Body.call(this, opts);
};

Anomaly.prototype = Object.create(Body.prototype);
Anomaly.prototype.constructor = Anomaly;

Anomaly.prototype.addEnergy = function () {
  this.mass += 0.5;
};

Anomaly.prototype.sapEnergy = function () {
  if (this.mass <= 1) {
    this.mass  = 0.0;
  } else {
    this.mass -= 0.5;
  };
};
