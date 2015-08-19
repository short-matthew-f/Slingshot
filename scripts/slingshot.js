var planets = [];

var $space = $("#space").attr('width', SVGSIZE).attr('height', SVGSIZE);

addGridToSpace();

$space.on('mousedown .body', function (e) {
  var $tar = $(e.target);

  if ($tar.is('.planet')) {
    var i = $(e.target).data('index'),
        body = planets[i];

    if (e.shiftKey) {
      body.mass += 0.25;
    } else {
      body.fixed = !body.fixed;
    };
  } else if ($tar.is('svg')) {
    var i = Math.floor(e.offsetX / GRIDSIZE),
        j = Math.floor(e.offsetY / GRIDSIZE);

    planets.push(new Body({
      position: new Vector(i, j),
      mass:     0.25,
      fixed:    true
    }));
  };
});

setInterval(function () {
  $('.body').remove();

  Body.updateSystem(planets);

  planets.forEach(function (planet, i) {
    planet.updateSVG();
    $space.append(planet.$el);
    planet.$el.attr('data-index', i);
  });

  $space.html($space.html());
}, TICKER)

$('#launch').on('click', function (e) {
  var ship = new Body({
    position: new Vector(1, GRIDCOUNT),
    velocity: new Vector(0, -0.1),
    isShip:   true,
    fixed:    false
  });

  planets.push(ship);
});

$('#swap').on('click', function (e) {
  planets.forEach(function (planet) {
    if (planet.isShip) { return; }
    
    planet.fixed = !planet.fixed;
  });
});

/* Utilities */

function addGridToSpace () {
  for (var i = 0; i < GRIDCOUNT; i++) {
    var hLine = $("<line class='grid'>").attr('x1', 0)
                   .attr('y1', i * GRIDSIZE)
                   .attr('x2', SVGSIZE)
                   .attr('y2', i * GRIDSIZE);
    var vLine = $("<line class='grid'>").attr('y1', 0)
                   .attr('x1', i * GRIDSIZE)
                   .attr('y2', SVGSIZE)
                   .attr('x2', i * GRIDSIZE);

    $space.append(hLine).append(vLine);
  };
};
