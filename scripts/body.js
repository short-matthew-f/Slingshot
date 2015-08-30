var Body = function (opts) {
  this.position     = opts.position     || new Vector(0, 0);
  this.velocity     = opts.velocity     || new Vector(0, 0);
  this.acceleration = opts.acceleration || new Vector(0, 0);
};

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
  Body.call(this, opts);

  this.mass = 1.0;
  this.type = 'ship';

  this.view = new ShipView(this);
};

Ship.prototype = Object.create(Body.prototype);
Ship.prototype.constructor = Ship;

// PLANET

var Planet = function Planet (opts) {
  Body.call(this, opts);

  this.mass = 1.0;
  this.type = 'planet';

  this.view = new PlanetView(this);
};

Planet.prototype = Object.create(Body.prototype);
Planet.prototype.constructor = Planet;

// ANOMALY

var Anomaly = function Anomaly (opts) {
  Body.call(this, opts);

  this.mass = 2.0;
  this.type = 'anomaly';

  this.view = new AnomalyView(this);
};

Anomaly.prototype = Object.create(Body.prototype);
Anomaly.prototype.constructor = Anomaly;

Anomaly.prototype.addEnergy = function () {
  this.mass *= 1.5;
};

Anomaly.prototype.sapEnergy = function () {
  this.mass /= 1.5;

  if (this.mass < 2.0) { this.mass  = 0.0; }
};
