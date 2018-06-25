function monsterCurve(t) {
  // Proportional length of section
  var introEnd = 0.11;
  var outroStart = 0.6;
  var v = 0;

  if (t < introEnd) {
    v = sin(HALF_PI * t / introEnd);
  } else if (t < outroStart) {
    v = 1.0;
  } else if (t < 1) {
    var outroDuration = 1 - outroStart;
    v = sin(HALF_PI + HALF_PI * (t-outroStart) / outroDuration);
  } else {
    v = 0.0;
  }

  v = ( v * -0.8 ) + 0.5;

  return v;
}

function MonsterAnimation(x, y, monster, duration) {
  var m = monster;
  var inPoint = frameCount;
  var outPoint = inPoint + duration;
  var amplitude = m.div.height;
  var origin = { x: x, y: y};

  this.run = function() {
    var f = frameCount;
    var t = (frameCount - inPoint) / duration;
    var v = amplitude * monsterCurve(t);

    var x = origin.x;
    var y = origin.y + v;

    m.moveTo(x, y);
  }
}
