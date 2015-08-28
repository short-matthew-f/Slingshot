/* Constants */

// GRAPHIC
SVGSIZE   = 600;
GRIDCOUNT = 11;
GRIDSIZE  = SVGSIZE / GRIDCOUNT;
TICKCOUNT = 50;
TICKER    = (1000 / TICKCOUNT);

// PHYSICAL
GRAVITY_EXPONENT    = 1.5;
GRAVITY_CORRECTION  = 2;
MINIMUM_DISTANCE    = 0.667;



/* Game */

$(function () {
  var universe     = window.universe     = new Universe,
      universeView = window.universeView = new UniverseView(universe);

  var timeAccumulated = 0,
      pastTime        = Date.now(),
      currentTime     = pastTime;

  var updateOnFrame = function () {
    var pleaseUpdate;

    pastTime = currentTime;
    currentTime = Date.now();
    timeAccumulated += currentTime - pastTime;

    while (timeAccumulated > TICKER) {
      pleaseUpdate = pleaseUpdate || true;

      universe.tick();
      timeAccumulated -= TICKER;
    };

    if (pleaseUpdate) { universeView.update(); }

    window.requestAnimationFrame(updateOnFrame);
  };

  window.requestAnimationFrame(updateOnFrame);

  $('#launch').on('click', function (e) {
    var ship = new Ship({
      position: new Vector(1, GRIDCOUNT),
      velocity: new Vector((Math.random() - 0.5) / 10, (Math.random() - 0.5) / 10)
    });

    universe.addBody(ship);
    universeView.addBody(ship);
  });
});
