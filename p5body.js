function p5Body (bodyType, x, y, w, h, p = {}, o = {}) {
  if (bodyType == 'circle'){
    this.body = Bodies[bodyType](x, y, w, o);
  } else if (bodyType == 'rectangle') {
    this.body = Bodies[bodyType](x, y, w, h, o);
  }

  World.add(engine.world, this.body);

  // Read image and resize

  this.show = function() {
    if (p.drawShape !== false) {
      noStroke();
      fill( p.fill || color(255, 0, 255) );

      beginShape();
      for (var i = 0, v = this.body.vertices, il = v.length; i < il; i++) {
        vertex(v[i].x, v[i].y);
      }
      endShape(CLOSE);
    }

    if (p.image || p.text){
      push();
      translate(this.body.position.x, this.body.position.y);
      rotate(this.body.angle);
      fill(0);
      if (p.image) {
        var drawWidth = null;
        var drawHeight = null;

        // Parameters remain null if image is not being resized
        if (p.imageResize){
          var s = (1 + (bodyType == 'circle')); // Returns 2 if circle, 1 if not - image width must be twice radius
          drawWidth = w * s;
          drawHeight = h * s;
        }
        image(p.image, 0, 0, drawWidth, drawHeight);
      }
      if (p.text) {
        textSize(1.75*h);
        text(p.text, 0, 0.6*h);
      }
      pop();
    }
  }

  this.isOffScreen = function() {
    var pos = this.body.position;
    var buffer = 100;
    return (pos.y > height + buffer || pos.x < -buffer || pos.y > width + buffer);
  }

  this.destroy = function() {
    World.remove(world, this.body);
  }
}
