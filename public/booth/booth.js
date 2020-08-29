var socket;
var myButton;

let BGcolor = `${'#'+Math.floor(Math.random()*16777215).toString(16)}`
let particles = [];
let clientID;
let otherPlayers = [];
let clientsConnected;
let clicks = 0;


/// background functions 

let penTiles;




function setup() {
  createCanvas(windowWidth, windowHeight);
  background(100);
  setupParticle();
  // Start a socket connection to the server
  // Some day we would run this server somewhere else
  socket = io.connect();
  // We make a named event called 'mouse' and write an
  // anonymous callback function

  penTiles = new PenroseLSystem();
  penTiles.simulate(5)

  socket.on('playerData', function (data) {

    otherPlayers.push(new shape(
      data.x,
      data.y,
      data.size,
      data.color,
      data.speedx,
      data.speedY,
      data.nickname,
      data.id,
      otherPlayers,
      data.clientid




    ));
    console.log(data.speedx);


  });
  // each client chooses their own color
  socket.on('colorData', function (colordata) {

    console.log(otherPlayers)
    console.log(colordata.clientID)
    for (let i = 0; i < otherPlayers.length; i++) {
      if (otherPlayers[i].client === colordata.clientID) {
        otherPlayers[i].color = colordata.color;


        ///color button

      }

    }

  });





}


function draw() {

  background(BGcolor);
  push();


  socket.on('bgChoice', function (BackData) {
    chooseBackground(BackData);
    console.log(BackData.choice);
  });

  pop();
  push();
  otherPlayers.forEach(shape => {
    shape.collide();
    shape.move();
    shape.show();
  });
  pop();


  socket.on('BlendButton',
    function (BlendData) {
      blendMode(`${BlendData.mode}`);
    }
  );
  socket.on('clearButton',
    function (ClearData) {
      BGcolor = ClearData.color
      background(`${ClearData.color}`);
    }
  );

}






let spring = 0.02;
let gravity = 0.05;
let friction = -0.9;


/// when a person comes in and clicks, add a
// shape that bounces around with a color tied to them
class shape {
  constructor(x, y, size, color, speedx, speedY, nickname, clicks, otherPlayers, clientID) {
    this.x = x;
    this.y = y;
    this.size = size;




    this.color = color;
    this.speedx = speedx;
    this.speedY = speedY;
    this.name = nickname;
    this.id = clicks;
    this.others = otherPlayers;
    this.client = clientID;

  }
  //stop moving to the right. 

  collide() { /// other otherPlayerss and otherPlayers need to be tracked. 
    //if (otherPlayers.length>2){
    for (let i = 1; i < this.others.length; i++) {
      //console.log(this.others[i].x );
      let dx = this.others[i].x - this.x;
      let dy = this.others[i].y - this.y;
      let distance = sqrt(dx * dx + dy * dy);
      let minDist = this.others[i].size + this.size;

      //console.log('helo')
      //  console.log(dx);
      //  console.log(dy)
      if (distance <= minDist) {

        let angle = atan2(dy, dx);
        let targetX = this.x + cos(angle) * minDist;
        let targetY = this.y + sin(angle) * minDist;
        let ax = (targetX - this.others[i].x) * spring;
        let ay = (targetY - this.others[i].y) * spring;
        this.speedx -= ax;
        this.speedY -= ay;
        this.others[i].speedx += ax;
        this.others[i].speedy += ay;
      }

    }


  }

  //}



  move() {

    this.speedy += gravity;
    this.x += this.speedx;
    this.y += this.speedY;
    if (this.x + this.size / 2 > width) {
      this.x = width - this.size / 2;
      this.speedx *= friction;
    } else if (this.x - this.size / 2 < 0) {
      this.x = this.size / 2;
      this.speedx *= friction;
    }
    if (this.y + this.size / 2 > height) {
      this.y = height - this.size / 2;
      this.speedY *= friction;
    } else if (this.y - this.size / 2 < 0) {
      this.y = this.size / 2;
      this.speedY *= friction;
    }
  }


  show() {
    //push();

    fill(this.color);





    stroke(0);
    strokeWeight(2);
    // draw otherPlayers
    ellipse(this.x, this.y, this.size);

    //push();
    strokeWeight(3);
    stroke(250);
    //rotate(PI);
    rectMode(CENTER)
    fill(this.color)
    rect(this.x, this.y, this.size / 1.5, this.size / 1.5)

    //pop();



    //style nickname

    stroke(200);
    strokeWeight(2);
    fill(250);


    // draw nickname
    textSize(25);
    text(`${this.name}`, this.x - (this.size / 4), this.y);
    //pop();
  }
}


function chooseBackground(bg) {

  if (bg.choice === "penTiles") {
    penTiles.render();
    console.log("penttiles");
  } else if (bg.choice === "noiseWave") {
    noiseWave();
    console.log("noiseWave");
  } else if (bg.choice === "particle") {
    console.log("particles");
    for (let i = 0; i < particles.length; i++) {
      // particles[i].createParticle();
      // particles[i].moveParticle();
      // particles[i].joinParticles(particles.slice(i));
      console.log('howdy bitch')
    }
  }
}