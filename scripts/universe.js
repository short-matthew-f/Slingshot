var Universe = function () {
  this.planets      = {};
  this.ships        = {};
  this.anomalies    = {};

  this.nextPlanetID  = 0;
  this.nextShipID    = 0;
  this.nextAnomalyID = 0;
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
