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
                  .attr("class", this.className());
};

BodyView.prototype.update = function () {
  var cx = GRIDSIZE * (this.body.position.x + 0.5),
      cy = GRIDSIZE * (this.body.position.y + 0.5),
      r  = this.radius();

  this.$el.attr("cx", cx)
          .attr("cy", cy)
          .attr("r",  r)
          .attr("class", this.className());;
};

BodyView.prototype.className = function () {
  var baseName  = "body",
      typeName  = this.body.constructor.name.toLowerCase();

  return [baseName, typeName].join(' ');
};

BodyView.prototype.radius = function () {
  if (this.body instanceof Ship) {
    return GRIDSIZE / 5;
  } else if (this.body instanceof Planet) {
    return GRIDSIZE / 2;
  } else {
    return GRIDSIZE * Math.sqrt(this.body.mass) / 4;
  }
};
