var GRAVITY_EXPONENT    = 1.5,
    GRAVITY_CORRECTION  = 4,
    MINIMUM_DISTANCE    = 0.667;

var Body = function (opts) {
  this.mass         = opts.mass         || 1;
  this.position     = opts.position     || new Vector(0, 0);
  this.velocity     = opts.velocity     || new Vector(0, 0);
  this.acceleration = opts.acceleration || new Vector(0, 0);

  this.type         = opts.type         || 'planet';
  this.isFree       = !!opts.isFree;

  this.$el          = this.toSVG();
};

Body.prototype.clone = function () {
  var _body = new Body({
    mass:         this.mass,
    position:     this.position.clone(),
    velocity:     this.velocity.clone(),
    acceleration: this.acceleration.clone(),
    type:         this.type,
    isFree:       this.isFree,
  });

  return _body;
};

Body.prototype.toSVG = function () {
  var cx = GRIDSIZE * (this.position.x + 0.5),
      cy = GRIDSIZE * (this.position.y + 0.5),
      r  = this.radius();

  var body = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

  body.classList.add("body", this.type, this.isFree ? 'free' : 'fixed');

  var $body = $(body).attr("cx", cx)
                     .attr("cy", cy)
                     .attr("r",  r);

  return $body;
};

Body.prototype.radius = function () {
  if (this.type === 'ship') {
    return GRIDSIZE / 5;
  } else {
    return GRIDSIZE * (4 + Math.log(this.mass, 2)) / 8;
  };
};

Body.prototype.updateSVG = function () {
  var cx = GRIDSIZE * (this.position.x + 0.5),
      cy = GRIDSIZE * (this.position.y + 0.5),
      r  = this.radius();

  this.$el.attr("cx", cx)
          .attr("cy", cy)
          .attr("r",  r);

  var el = this.$el[0];
  if (this.isFree) {
    el.classList.remove('fixed');
    el.classList.add('free');
  } else {
    el.classList.remove('free');
    el.classList.add('fixed');
  };
};

Body.prototype.gravityFrom = function (otherBody) {
  var direction = Vector.subtract(otherBody.position, this.position),
      distance  = Vector.distance(this.position, otherBody.position),
      radius    = Math.max(MINIMUM_DISTANCE, distance),
      gravity   = otherBody.mass / Math.pow(radius, GRAVITY_EXPONENT);

  return direction.normalize().multiply(gravity / GRAVITY_CORRECTION);
};


Body.prototype.calculateNextAcceleration = function (universe) {
  var applyGravity = function (target, actor) {
    target.acceleration.add(target.gravityFrom(actor));
  }

  if (this.isFree) {
    var body       = this,
        planetIDs  = Object.keys(universe.planets),
        anomalyIDs = Object.keys(universe.anomalies);

    planetIDs.forEach(function (id) {
      var planet = universe.planets[id];
      if (body !== planet) { applyGravity(body, planet) };
    });

    anomalyIDs.forEach(function (id) {
      var anomaly = universe.anomalies[id];
      if (body !== anomaly) { applyGravity(body, anomaly) }
    });
  } else {
    this.velocity.x     = 0;
    this.velocity.y     = 0;
    this.acceleration.x = 0;
    this.acceleration.y = 0;
  };
};

Body.prototype.calculateNextVelocity = function () {
  this.velocity.add(this.acceleration.multiply(1 / TICKCOUNT));
};

Body.prototype.calculateNextPosition = function () {
  this.position.add(this.velocity);
};
