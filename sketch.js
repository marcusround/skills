// module aliases
var Engine = Matter.Engine,
    // Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies;
    Common = Matter.Common;

var engine;
var world;
var gravity;
var particles = [];
var colliders = [];
var monsters = [];

var testImg;
var lessonBadges = [];

var ver = 1128;
var debug = false;

var bgColor = '#00cccc';

var updateGravityHasRun = false;

var monsterAnimations = [null,null,null,null,null,null];

function setup() {
  createCanvas(windowWidth, windowHeight);
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

  // Let's try adding a monster.
  monsters.push(new p5Body("circle", -width * 0.75, height * 0.75, 75, 75, {drawShape: false, json: 'animations/gremlin_1.json'}, {isStatic: true}));
  monsters.push(new p5Body("circle", -width * 0.75, height * 0.75, 80, 80, {drawShape: false, json: 'animations/gremlin_3.json'}, {isStatic: true}));
  monsters.push(new p5Body("circle", -width * 0.75, height * 0.75, 125, 125, {drawShape: false, json: 'animations/gremlin_4.json'}, {isStatic: true}));
  monsters.push(new p5Body("circle", -width * 0.75, height * 0.75, 100, 100, {drawShape: false, json: 'animations/gremlin_5.json'}, {isStatic: true}));
  monsters.push(new p5Body("circle", -width * 0.75, height * 0.75, 80, 80, {drawShape: false, json: 'animations/gremlin_2.json'}, {isStatic: true}));
  monsters.push(new p5Body("circle", -width * 0.75, height * 0.75, 90, 90, {drawShape: false, json: 'animations/gremlin_6.json'}, {isStatic: true}));

  Engine.run(engine);
}

var autoGravity = (!window.orientation);

var creationTrigger = true;

var animationIndex = 0;

function draw() {
  background(bgColor);

  if (autoGravity) {
    gravity.x = map(mouseX, 0, width, -1, 1);
    gravity.y = map(mouseY, 0, height, -1, 1);
  }

  if (creationTrigger && lessonBadges.length > 29){
    for (var i = 0, il = 40; i < il; i++){
      var n = Math.floor(random(lessonBadges.length));
      particles.push(new p5Body("circle", width/2 + random(-20,20), height * 0.4 + random(-20,20), 40, 40, {image: lessonBadges[n], drawShape: false, imageResize: true}, {friction: 0.0, restitution: 0.4}));
    }
    creationTrigger = false;
  }

  if (frameCount % 600 == 150) {
    monsterAnimations[animationIndex] = new MonsterAnimation(width * (0.2 + 0.8 * random()), height * 1, monsters[animationIndex], 600);
    animationIndex = ( animationIndex + 1 ) % monsters.length;
  } else if (frameCount > 50) {
    for (var i = 0, il = monsterAnimations.length; i < il; i++) {
      if (monsterAnimations[i]) {
        monsterAnimations[i].run();
      }
    }
  }

/*
  (function moveMonster() {
    var m = monsters[0];
    var x = 200 + 200 * sin(frameCount/50);
    var y = 200 + 220 * sin(frameCount/29);
    m.moveTo(x, y);
  })();
*/
  showAll(particles);
  showAll(monsters);
  showAll(colliders);

  if (debug) {
    text (ver, 150, 150);
    text (autoGravity, 150, 200);
    var orientation = window.orientation;
    if (!window.orientation) {
      orientation = 'no orientation';
    }
    text (orientation, 150, 250);
    text (updateGravityHasRun, 150, 300);
  }
}

function showAll(arr) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].show){
      arr[i].show();
    }
    /* Disabled checking to prevent monsters being destroyed
    if (arr[i].isOffScreen && arr[i].isOffScreen()){
      arr[i].destroy();
      arr.splice(i,1);
      i--;
    }
    */
  }
}

function mouseDragged() {
  /*
  var emojiChance = 1.0;
  if (lessonBadges.length > 0 && random() < (1 - emojiChance)) {
    var i = Math.floor(random(lessonBadges.length));
    particles.push(new p5Body("circle", mouseX, mouseY, 40, 40, {image: lessonBadges[i], drawShape: false, imageResize: true}, {friction: 0.0, restitution: 0.4}));
  } else {
    var emojis = ["😀","😁","😂","🤣","😃","😄","😅","😆","😉","😊","😋","😎","😍","😘","😗","😙","😚","🙂","🤗","🤩","🤔","🤨","😐","😑","😶","🙄","😏","😣","😥","😮","🤐","😯","😪","😫","😴","😌","😛","😜","😝","🤤","😒","😓","😔","😕","🙃","🤑","😲","🙁","😖","😞","😟","😤","😢","😭","😦","😧","😨","😩","🤯","😬","😰","😱","😳","🤪","😵","😡","😠","🤬","😷","🤒","🤕","🤢"];
    var str = emojis[Math.floor(random(emojis.length))];
    particles.push(new p5Body("circle", mouseX, mouseY, 20, 20, {text: str, drawShape: false}, {friction: 0.1, restitution: 0.9}));
  }
  */
}

/* add gyro control */
var updateGravity = function(event) {
  if (!autoGravity){
    updateGravityHasRun = true;

    var orientation = window.orientation;

    if (orientation === 0) {
        gravity.x = Common.clamp(event.gamma, -45, 45) / 45;
        gravity.y = Common.clamp(event.beta, -45, 45) / 45;
    } else if (orientation === 180) {
        gravity.x = Common.clamp(event.gamma, -45, 45) / 45;
        gravity.y = Common.clamp(-event.beta, -45, 45) / 45;
    } else if (orientation === 90) {
        gravity.x = Common.clamp(event.beta, -45, 45) / 45;
        gravity.y = Common.clamp(-event.gamma, -45, 45) / 45;
    } else if (orientation === -90) {
        gravity.x = Common.clamp(-event.beta, -45, 45) / 45;
        gravity.y = Common.clamp(event.gamma, -45, 45) / 45;
    }

  }
};

window.addEventListener('deviceorientation', updateGravity);
/* end gyro control */
