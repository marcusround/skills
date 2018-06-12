// module aliases
var Engine = Matter.Engine,
    // Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies;

var engine;
var world;
var gravity;
var particles = [];
var colliders = [];

var testImg;
var lessonBadges = [];

function setup() {
  createCanvas(1280,720);
  engine = Engine.create();
  world = engine.world;
  gravity = engine.world.gravity;

  imageMode(CENTER);
  textAlign(CENTER);

  for (var i = 0; i < 31; i++) {
    var path = 'assets/lessonBadges/lr/'+ nf(i, 2, 0) + '.png';
    loadImage(path, function(img){
      lessonBadges.push(img);
    });
  }

  // Load header and push as collider
  loadImage('assets/header.png', function(img){
    var w = img.width;
    var h = img.height;
    var scalar = width/w;
    w *= scalar;
    h *= scalar;
    var x = width/2;

    // Stick to top
    var y = ( h * 0.5 );

    colliders.push(new p5Body("rectangle", x, y, w, h, {drawShape: false, image: img, imageResize: true}, {isStatic: true}));
  });

  // Load footer and push as collider
  loadImage('assets/footer.png', function(img){
    var w = img.width;
    var h = img.height;
    var scalar = width/w;
    w *= scalar;
    h *= scalar;
    var x = width/2;

    // Stick to bottom
    var y = height - ( h * 0.5 );

    colliders.push(new p5Body("rectangle", x, y, w, h, {drawShape: false, image: img, imageResize: true}, {isStatic: true}));
  });

  // Load centre box and push as collider.....
  loadImage('assets/textBox.png', function(img){
    var w = img.width;
    var h = img.height;

    // Unlike above, this does not span entire width. Adjust to taste
    var scalar = (width * 0.33)/w;
    w *= scalar;
    h *= scalar;
    var x = width/2;

    // Manual placement
    var y = height * 0.4;

    colliders.push(new p5Body("rectangle", x, y, w, h, {drawShape: true, image: img, imageResize: true}, {isStatic: true, friction: 0}));
  });

  // Add left and right edge colliders
  colliders.push(new p5Body("rectangle", width + 50, height/2, 100, height, {drawShape: false}, {isStatic: true}));
  colliders.push(new p5Body("rectangle", -50, height/2, 100, height, {drawShape: false}, {isStatic: true}));

  Engine.run(engine);
}

var userGravity = (typeof window.orientation !== 'undefined');

var creationTrigger = true;

function draw() {
  background(244);

  if (!userGravity) {
    gravity.x = Math.sin(frameCount / 100);
    gravity.y = Math.cos(frameCount / 100);
  }

  if (creationTrigger && lessonBadges.length > 29){
    for (var i = 0, il = 40; i < il; i++){
      var n = Math.floor(random(lessonBadges.length));
      particles.push(new p5Body("circle", width/2 + random(-5,5), height/2 + random(-5,5), 40, 40, {image: lessonBadges[n], drawShape: false, imageResize: true}, {friction: 0.0, restitution: 0.4}));
    }
    creationTrigger = false;
  }

  showAll(particles);
  showAll(colliders);
}

function showAll(arr) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].show){
      arr[i].show();
    }
    if (arr[i].isOffScreen && arr[i].isOffScreen()){
      arr[i].destroy();
      arr.splice(i,1);
      i--;
    }
  }
}

function mouseDragged() {
  var emojiChance = 1.0;
  if (lessonBadges.length > 0 && random() < (1 - emojiChance)) {
    var i = Math.floor(random(lessonBadges.length));
    particles.push(new p5Body("circle", mouseX, mouseY, 40, 40, {image: lessonBadges[i], drawShape: false, imageResize: true}, {friction: 0.0, restitution: 0.4}));
  } else {
    var emojis = ["😀","😁","😂","🤣","😃","😄","😅","😆","😉","😊","😋","😎","😍","😘","😗","😙","😚","🙂","🤗","🤩","🤔","🤨","😐","😑","😶","🙄","😏","😣","😥","😮","🤐","😯","😪","😫","😴","😌","😛","😜","😝","🤤","😒","😓","😔","😕","🙃","🤑","😲","🙁","😖","😞","😟","😤","😢","😭","😦","😧","😨","😩","🤯","😬","😰","😱","😳","🤪","😵","😡","😠","🤬","😷","🤒","🤕","🤢"];
    var str = emojis[Math.floor(random(emojis.length))];
    particles.push(new p5Body("circle", mouseX, mouseY, 20, 20, {text: str, drawShape: false}, {friction: 0.1, restitution: 0.9}));
  }
}

/* add gyro control */
var updateGravity = function(event) {
  if (userGravity){
    var orientation = window.orientation;

    if (orientation === 0) {
        gravity.x = Common.clamp(event.gamma, -90, 90) / 90;
        gravity.y = Common.clamp(event.beta, -90, 90) / 90;
    } else if (orientation === 180) {
        gravity.x = Common.clamp(event.gamma, -90, 90) / 90;
        gravity.y = Common.clamp(-event.beta, -90, 90) / 90;
    } else if (orientation === 90) {
        gravity.x = Common.clamp(event.beta, -90, 90) / 90;
        gravity.y = Common.clamp(-event.gamma, -90, 90) / 90;
    } else if (orientation === -90) {
        gravity.x = Common.clamp(-event.beta, -90, 90) / 90;
        gravity.y = Common.clamp(event.gamma, -90, 90) / 90;
    }
  }
};

window.addEventListener('deviceorientation', updateGravity);
/* end gyro control */
