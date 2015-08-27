var Slingshot = function Slingshot () {
  this.universe     = new Universe();
  this.universeView = new UniverseView(universe);
};


$(function () {
  var universe     = window.universe     = new Universe,
      universeView = window.universeView = new UniverseView(universe);

  setInterval(function () {
    universe.tick();
    universeView.update();
  }, TICKER)

  $('#launch').on('click', function (e) {
    var ship = new Ship({
      position: new Vector(1, GRIDCOUNT),
      velocity: new Vector(0, -0.1)
    });

    universe.addBody(ship);
    universeView.addBody(ship);
  });

  $('#swap').on('click', function (e) {
    var planetIDs = Object.keys(universe.planets);


    planetIDs.forEach(function (id) {
      var planet = universe.planets[id];

      planet.isFree = !planet.isFree;
    });
  });
});
