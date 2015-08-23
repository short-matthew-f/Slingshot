$(function () {
  var universe     = new Universe,
      universeView = new UniverseView("#space", universe);

  setInterval(function () {
    universe.tick();
    universeView.update();
  }, TICKER)

  $('#launch').on('click', function (e) {
    var ship = new Body({
      position: new Vector(1, GRIDCOUNT),
      velocity: new Vector(0, -0.1),
      type:     'ship',
      isFixed:  false
    });

    universe.add(ship);
    universeView.add(ship);
  });

  $('#swap').on('click', function (e) {
    $.each(universe.planets, function (id, planet) {
      planet.isFixed = !planet.isFixed;
    });
  });
});
