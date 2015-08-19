var planets = [];

var $space = $("#space").attr('width', SVGSIZE)
                        .attr('height', SVGSIZE);

addGridToSpace();

$space.on('mousedown .body', function (e) {
  var $tar = $(e.target);

  if ($tar.is('.planet')) {
    var i = $(e.target).data('index'),
        body = planets[i];

    if (e.shiftKey) {
      body.mass += 0.25;
    } else {
      body.isFixed = !body.isFixed;
    };
  } else if ($tar.is('svg')) {
    var i       = Math.floor(e.offsetX / GRIDSIZE),
        j       = Math.floor(e.offsetY / GRIDSIZE),
        newBody = new Body({
          position: new Vector(i, j),
          type:     'planet',
          mass:     0.25,
          isFixed:  true
        });

    planets.push(newBody);
    $space.append(newBody.$el);
  };
});

setInterval(function () {
  Body.updateSystem(planets);

  planets.forEach(function (planet, i) {
    planet.updateSVG();
    planet.$el.attr('data-index', i);
  });

  // $space.html($space.html());
}, TICKER)

$('#launch').on('click', function (e) {
  var ship = new Body({
    position: new Vector(1, GRIDCOUNT),
    velocity: new Vector(0, -0.1),
    type:     'ship',
    isFixed:  false
  });

  planets.push(ship);
  $space.append(ship.$el);
});

$('#swap').on('click', function (e) {
  planets.forEach(function (planet) {
    if (planet.type == 'ship') { return; }

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
