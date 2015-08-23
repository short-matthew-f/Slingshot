var Universe = function () {
  this.planets      = {};
  this.ships        = {};
  this.anomalies    = {};

  this.nextPlanetID  = 0;
  this.nextShipID    = 0;
  this.nextAnomalyID = 0;
};

Universe.prototype.clone = function () {
  var _universe  = new Universe(),
      planetIDs  = Object.keys(this.planets),
      shipIDs    = Object.keys(this.ships),
      anomalyIDs = Object.keys(this.anomalies);

  var thisUniverse = this;

  planetIDs.forEach(function (id) {
    _universe.add(thisUniverse.planets[id].clone());
  });

  shipIDs.forEach(function (id) {
    _universe.add(thisUniverse.ships[id].clone());
  });

  anomalyIDs.forEach(function (id) {
    _universe.add(thisUniverse.anomalies[id].clone());
  });

  return _universe;
};

Universe.prototype.add = function (body) {
  switch (body.type) {
    case 'planet':
      this.planets[this.nextPlanetID] = body;
      body.id = this.nextPlanetID;
      this.nextPlanetID += 1;
      break;
    case 'ship':
      this.ships[this.nextShipID] = body;
      body.id = this.nextShipID;
      this.nextShipID += 1;
      break;
    case 'anomaly':
      this.anomalies[this.nextAnomalyID] = body;
      body.id = this.nextAnomalyID;
      this.nextAnomalyID += 1;
      break;
  };

  body.$el.data('id', body.id);
};

Universe.prototype.tick = function () {
  var universe  = this,
      planetIDs = Object.keys(this.planets),
      shipIDs   = Object.keys(this.ships);

  planetIDs.forEach(function (id) {
    universe.planets[id]
            .calculateNextAcceleration(universe);
    universe.planets[id]
            .calculateNextVelocity();
  });

  shipIDs.forEach(function (id) {
    universe.ships[id]
            .calculateNextAcceleration(universe);
    universe.ships[id]
            .calculateNextVelocity();
  });

  planetIDs.forEach(function (id) {
    universe.planets[id].calculateNextPosition();
  });

  shipIDs.forEach(function (id) {
    universe.ships[id]
            .calculateNextPosition();
  });
};
