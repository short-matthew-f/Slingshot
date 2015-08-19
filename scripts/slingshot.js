var universe = new Universe;

var $space = $("#space").attr('width', SVGSIZE)
                        .attr('height', SVGSIZE);

addGridToSpace();
addPlanetsToSpace();

$space.on('mousedown .body', function (e) {
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
    $space.append(anomaly.$el);
  };
});

setInterval(function () {
  Body.updateSystem(universe);

  $.each(universe.planets, function (id, planet) {
    planet.updateSVG();
  });

  $.each(universe.ships, function (id, ship) {
    ship.updateSVG();
  });

  $.each(universe.anomalies, function (id, anomaly) {
    anomaly.updateSVG();
  });
}, TICKER)

$('#launch').on('click', function (e) {
  var ship = new Body({
    position: new Vector(1, GRIDCOUNT),
    velocity: new Vector(0, -0.1),
    type:     'ship',
    isFixed:  false
  });

  universe.add(ship);
  $space.append(ship.$el);
});

$('#swap').on('click', function (e) {
  $.each(universe.planets, function (id, planet) {
    planet.isFixed = !planet.isFixed;
  });
});

/* Utilities */

function addGridToSpace () {
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

    $space.append($hLine).append($vLine);
  };
};

function addPlanetsToSpace () {
  for (var i = 0; i < 2; i++) {
    var row = Math.floor(Math.random() * GRIDCOUNT),
        col = Math.floor(Math.random() * GRIDCOUNT);

    var planet = new Body({
      position: new Vector(row, col),
      type:     'planet',
      mass:     1,
      isFixed:  true
    });

    universe.add(planet);
    $space.append(planet.$el);
  }
}
