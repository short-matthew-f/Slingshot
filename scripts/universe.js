var Universe = function () {
  this.gravs = [];
  this.ships = [];

  this.setGrid();
};

Universe.prototype.setGrid = function () {
  this.grid = [];

  for (var i = 0; i < GRIDCOUNT; i++) {
    this.grid[i] = new Array(GRIDCOUNT);
  };
};


Universe.prototype.addEnergy = function (row, column) {
  var result = {};

  if (this.hasPlanetAt(row, column)) {
    throw new Error("Your device has no effect on planets!");
  } else if (this.hasAnomalyAt(row, column)) {
    result.isNew   = false;
    result.anomaly = this.grid[row][column];

    result.anomaly.addEnergy();
  } else {
    result.isNew   = true;
    result.anomaly = new Anomaly({
      position: new Vector(row, column)
    });

    this.addBody(result.anomaly);
  };

  return result;
};

Universe.prototype.sapEnergy = function (row, column) {
  var result = {};
  if (this.hasPlanetAt(row, column)) {
    throw new Error("Your device has no effect on planets!");
  } else if (this.hasAnomalyAt(row, column)) {
    result.anomaly = this.grid[row][column];
    result.anomaly.sapEnergy();

    if (result.anomaly.mass === 0) {
      result.isDead = true;
    } else {
      result.isDead = false;
    };
  } else {
    throw new Error("Can't remove energy when there isn't any to take!")
  };

  return result;
};

Universe.prototype.hasPlanetAt = function (row, column) {
  return this.grid[row][column] instanceof Planet;
};

Universe.prototype.hasAnomalyAt = function (row, column) {
  return this.grid[row][column] instanceof Anomaly;
};

Universe.prototype.addBody = function (body) {
  if (body instanceof Ship) {
    this.ships.push(body);
  } else {
    this.grid[body.position.x][body.position.y] = body;
    this.gravs.push(body);
  };
};

Universe.prototype.removeBody = function (row, column) {
  var _body = this.grid[row][column];

  if (_body) {
    var _index = this.gravs.indexOf(_body);
    this.gravs.splice(_index, 1);
    this.grid[row][column] = undefined;
  };
};

Universe.applyGravity = function (target, actor) {
  target.acceleration.add(target.gravityFrom(actor));
};

Universe.prototype.setShipAccelerations = function () {
  var universe = this,
      ships    = universe.ships,
      gravs    = universe.gravs;

  ships.forEach(function (ship, i) {
    gravs.forEach(function (grav, j) {
      Universe.applyGravity(ship, grav);
    });
  });
};

Universe.prototype.setShipVelocities = function () {
  this.ships.forEach(function (ship, i) {
    ship.velocity.add(ship.acceleration.multiply(1 / TICKCOUNT));
  });
};

Universe.prototype.moveShips = function () {
  this.ships.forEach(function (ship, i) {
    ship.position.add(ship.velocity);
  });
};

Universe.prototype.tick = function () {
  this.setShipAccelerations();
  this.setShipVelocities();
  this.moveShips();
};

//
// Universe.prototype.clone = function () {
//   var _universe  = new Universe(),
//       planetIDs  = Object.keys(this.planets),
//       shipIDs    = Object.keys(this.ships),
//       anomalyIDs = Object.keys(this.anomalies);
//
//   var thisUniverse = this;
//
//   planetIDs.forEach(function (id) {
//     _universe.add(thisUniverse.planets[id].clone());
//   });
//
//   shipIDs.forEach(function (id) {
//     _universe.add(thisUniverse.ships[id].clone());
//   });
//
//   anomalyIDs.forEach(function (id) {
//     _universe.add(thisUniverse.anomalies[id].clone());
//   });
//
//   return _universe;
// };
