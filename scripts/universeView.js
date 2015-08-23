function UniverseView (id, universe) {
  this.$el = $(id);
  this.universe = universe;

  this.initialize();
};

UniverseView.prototype.initialize = function () {
  this.setSize();
  this.setGrid();
  this.setPlanets(2);
  this.setHandlers();
};

UniverseView.prototype.setSize = function () {
  this.$el.attr('width', SVGSIZE).attr('height', SVGSIZE);
};

UniverseView.prototype.setGrid = function () {
  for (var i = 0; i < GRIDCOUNT; i++) {
    var hLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    var vLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    var $hLine = $(hLine).attr('class', 'grid')
                   .attr('x1', 0)
                   .attr('y1', i * GRIDSIZE)
                   .attr('x2', SVGSIZE)
                   .attr('y2', i * GRIDSIZE);
    var $vLine = $(vLine).attr('class', 'grid')
                   .attr('y1', 0)
                   .attr('x1', i * GRIDSIZE)
                   .attr('y2', SVGSIZE)
                   .attr('x2', i * GRIDSIZE);

    this.$el.append($hLine).append($vLine);
  };
};

UniverseView.prototype.setPlanets = function (count) {
  for (var i = 0; i < count; i++) {
    var row = Math.floor(Math.random() * GRIDCOUNT),
        col = Math.floor(Math.random() * GRIDCOUNT);

    var planet = new Body({
      position: new Vector(row, col),
      type:     'planet',
      mass:     1,
      isFixed:  true
    });

    this.universe.add(planet);
    this.$el.append(planet.$el);
  };
};

UniverseView.prototype.setHandlers = function () {
  var universe     = this.universe,
      universeView = this;

  universeView.$el.on('mousedown .body', function (e) {
    var $tar = $(e.target);

    if ($tar.is('.anomaly')) {
      var id      = $(e.target).data('id'),
          anomaly = universe.anomalies[id];

      if (e.shiftKey) {
        anomaly.$el.remove()
        delete universe.anomalies[id];
      } else {
        anomaly.mass += 0.25;
      }
    } else if ($tar.is('svg')) {
      var i       = Math.floor(e.offsetX / GRIDSIZE),
          j       = Math.floor(e.offsetY / GRIDSIZE),
          anomaly = new Body({
            position: new Vector(i, j),
            type:     'anomaly',
            mass:     0.25,
            isFixed:  true
          });

      universe.add(anomaly);
      universeView.add(anomaly);
    };
  });
};

UniverseView.prototype.add = function (body) {
  this.$el.append(body.$el);
};

UniverseView.prototype.update = function () {
  var universe   = this.universe,
      planetIDs  = Object.keys(this.universe.planets),
      shipIDs    = Object.keys(this.universe.ships),
      anomalyIDs = Object.keys(this.universe.anomalies);

  planetIDs.forEach(function (id) {
    universe.planets[id].updateSVG();
  });

  shipIDs.forEach(function (id) {
    universe.ships[id].updateSVG();
  });

  anomalyIDs.forEach(function (id) {
    universe.anomalies[id].updateSVG();
  });
};
