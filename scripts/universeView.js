function UniverseView (universe) {
  this.$space    = $("#space");

  this.universe  = universe;
  this.commander = new Commander();

  this.initialize();
};

UniverseView.prototype.initialize = function () {
  this.setSVGSize();
  this.setGridLines();
  this.setCommander();
  this.setListeners();
};

UniverseView.prototype.updateView = function (bodyView) {
  if (bodyView.isPresent) {
    bodyView.update();
  } else {
    this.$space.append(bodyView.$el);
    bodyView.isPresent = true;
  };
};

UniverseView.prototype.update = function () {
  this.universe.ships.forEach(function (ship, i) {
    ship.view.update();
  });
};


UniverseView.prototype.setCommander = function () {
  var addEnergy = this.addEnergy.bind(this),
      sapEnergy = this.sapEnergy.bind(this);

  addEnergy.doName   = 'addEnergy';
  addEnergy.undoName = 'sapEnergy';

  sapEnergy.doName   = 'sapEnergy';
  sapEnergy.undoName = 'addEnergy';

  this.commander.addFunctions(addEnergy, sapEnergy);
};


UniverseView.prototype.addEnergy = function (row, column) {
  if (this.universe.hasPlanetAt(row, column)) {
    throw new Error("Your device has no effect on planets!");
  } else {
    try {
      var result = this.universe.addEnergy(row, column);

      if (result.isNew) {
        this.addBody(result.anomaly);
      } else {
        this.updateBody(result.anomaly);
      };
    } catch (error) {
      throw error;
    }
  }
};


UniverseView.prototype.sapEnergy = function (row, column) {
  if (this.universe.hasPlanetAt(row, column)) {
    throw new Error("Your device has no effect on planets!");
  } else {
    try {
      var result = this.universe.sapEnergy(row, column);

      if (result.isDead) {
        this.removeBody(result.anomaly);
        this.universe.removeBody(row, column);
      } else {
        this.updateBody(result.anomaly);
      };
    } catch (error) {
      throw error;
    }
  }
};

UniverseView.prototype.setSVGSize = function () {
  this.$space.attr('width', SVGSIZE).attr('height', SVGSIZE);
};

UniverseView.prototype.setGridLines = function () {
  for (var i = 0; i <= GRIDCOUNT; i++) {
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

    this.$space.append($hLine).append($vLine);
  };
};

UniverseView.prototype.setListeners = function () {
  var universe     = this.universe,
      universeView = this;

  this.$space.on('mousedown', function (e) {
    if ($(e.target).is('svg')) {
      var x = e.offsetX,
          y = e.offsetY;
    } else {
      var x = e.originalEvent.layerX,
          y = e.originalEvent.layerY;
    };

    var row    = Math.floor(x / GRIDSIZE),
        column = Math.floor(y / GRIDSIZE);

    if (e.shiftKey) {
      var result = universeView.commander.do('sapEnergy', row, column);
    } else {
      var result = universeView.commander.do('addEnergy', row, column);
    };
  });

  $('#undo').on('click', function (e) {
    universeView.commander.undo();
  });

  $('#redo').on('click', function (e) {
    universeView.commander.redo();
  });
};

UniverseView.prototype.addBody = function (body) {
  this.$space.append(body.view.$el);
};

UniverseView.prototype.updateBody = function (body) {
  body.view.update();
};

UniverseView.prototype.removeBody = function (body) {
  body.view.$el.remove();
};
