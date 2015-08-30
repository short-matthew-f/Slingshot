var BodyView = function (body) {
  this.body = body;
  this.initialize();
};

BodyView.prototype.initialize = function () {
  var el = document.createElementNS('http://www.w3.org/2000/svg', 'circle'),
      cx   = GRIDSIZE * (this.body.position.x + 0.5),
      cy   = GRIDSIZE * (this.body.position.y + 0.5),
      r    = this.radius();

  this.$el = $(el).attr("cx", cx)
                  .attr("cy", cy)
                  .attr("r",  r)
                  .attr("class", this.className);
};

BodyView.prototype.update = function () {
  var cx = GRIDSIZE * (this.body.position.x + 0.5),
      cy = GRIDSIZE * (this.body.position.y + 0.5),
      r  = this.radius();

  this.$el.attr("cx", cx)
          .attr("cy", cy)
          .attr("r",  r);
};


var ShipView = function (body) {
  this.className = "body ship";

  BodyView.call(this, body);
};

ShipView.prototype = Object.create(BodyView.prototype);
ShipView.prototype.constructor = ShipView;

ShipView.prototype.radius = function () {
  return GRIDSIZE / 5;
};

var PlanetView = function (body) {
  this.className = "body planet";

  BodyView.call(this, body);
};

PlanetView.prototype = Object.create(BodyView.prototype);
PlanetView.prototype.constructor = PlanetView;

PlanetView.prototype.radius = function () {
  return GRIDSIZE / 2;
};

var AnomalyView = function (body) {
  this.className = "body anomaly";

  BodyView.call(this, body);
};

AnomalyView.prototype = Object.create(BodyView.prototype);
AnomalyView.prototype.constructor = AnomalyView;

AnomalyView.prototype.radius = function () {
  return GRIDSIZE * Math.sqrt(this.body.mass) / 4;
};
