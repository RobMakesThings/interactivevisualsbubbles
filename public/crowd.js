// ITP Networked Media, Fall 2014
// https://github.com/shiffman/itp-networked-media
// Daniel Shiffman





//// click once to add yourself, click more times to change yourself




// Keep track of our socket connection
var socket;
let BGcolor = `${'#'+Math.floor(Math.random()*16777215).toString(16)}`

var nickname = prompt('Enter a nickname, 3 letters max, \n emojis for full effect', '🔉🎶📀');
// buttons using p5.clickable
var blendButton;
let bModes = [];
var clearButton;

//player vars


let player = [];
let otherPlayers = [];
let clicks = 0;

var mojis = ["😀", "😁", "😂", "🤣", "😎", "😄", "😆", "🤑", "😠", "🌍", "🎉", "👍", "💎"];
let myMoji = mojis[Math.floor(Math.random() * mojis.length)];


function setup() {
  nickname = nickname.substr(0, 4);
  console.log(nickname);
  //frameRate(24);

  color = `${'#'+Math.floor(Math.random()*16777215).toString(16)}`;
  var myCanvas = createCanvas(windowWidth, windowHeight);
  myCanvas.parent("canvas");
  size = random(20, 50);
  bModes = [OVERLAY, DARKEST, SOFT_LIGHT, BLEND];


  background(100);
  // Start a socket connection to the server
  // Some day we would run this server somewhere else
  socket = io.connect();
  // We make a named event called 'mouse' and write an
  // anonymous callback function
  socket.on('mouse',
    // When we receive data
    function (data) {
      console.log("Got: " + data.x + " " + data.y);
      // Draw a blue circle
      fill(0);
      //stroke(250);
      textSize(100);
      text(data.Emoji, data.x, data.y, );
    }
  );

  socket.on('playerData', function (data) {
    console.log("Got: " + data.x + " " + data.speedY);
    otherPlayers[data.clicks] = new shape(
      data.x,
      data.y,
      data.size,
      data.color,
      random(2, 10),
      random(5, 6)
    );



  });

  ///
  buttons();


  // socket.on('ClientEmoji',
  // // When we receive data
  // function(data) {
  //   var data ={
  //       "emoji":myMoji
  //   };
  // }
  // );
}
//creates a random blend mode to send to the server 


function draw() {
  background(BGcolor);
  socket.on('BlendButton',
    function (BlendData) {
      blendMode(`${BlendData.mode}`);
    }
  );
  socket.on('clearButton',
    function (ClearData) {
      background(`${ClearData.color}`);
    }
  );


  otherPlayers.forEach(shape => {
    shape.collide();
    shape.move();
    shape.show();
  });
  player.forEach(shape => {
    shape.collide();
    shape.move();
    shape.show();
  });
  push();
  blendMode(BLEND);
  blendButton.draw();
  clearButton.draw();
  shapeButton.draw();
  pop();
}

// function mouseDragged() {
//   // Draw some white circles
//   fill(255);
//   stroke(0);
//   textSize(100);
//  text( `${myMoji}`, mouseX, mouseY);
//   // Send the mouse coordinates

// }



function mousePressed() {
  speedx = random(-10, 10);
  speedY = random(-10, 10);
  size = random(100, 200);
  console.log('thats a click');

  if (clicks <= 10) {
    player[clicks] = new shape(
      mouseX,
      mouseY,
      size,
      color,
      speedx,
      speedY,
      nickname,
      clicks,
      otherPlayers,
      player
    );
    clicks++;
    let data = {
      x: mouseX,
      y: mouseY,
      size: size,
      color: color,
      speedx: speedx,
      speedY: speedY,
      nickname: nickname,
      id: clicks,
      clientid: socket.id


    };
    socket.emit('playerData', data);
    console.log(data);
  }

}

let shapeButton;

function buttons() {
  blendButton = new Clickable(); //Create button
  blendButton.locate(120, (windowHeight) - 70);
  blendButton.text = "Blend"; //Position Button
  blendButton.color = "#03fcdb";
  clearButton = new Clickable(); //Create button
  clearButton.text = "Stage Color"; //Position Button
  clearButton.locate(240, windowHeight - 70);
  clearButton.color = "#03fcdb";
  shapeButton = new Clickable();
  shapeButton.locate(360, windowHeight - 70);
  shapeButton.text = 'My Color';
  shapeButton.color = '#ff7d45';


  ///

  // styling buttons 
  blendButton.cornerRadius = 2;
  clearButton.cornerRadius = 2;
  shapeButton.cornerRadius = 2;

  blendButton.onRelease = function () {
    blendButton.cornerRadius = 2;
  };


  ///
  blendButton.onPress = function () { //When blendButton is pressed
    this.color = "#befc03"; //Change button color
    //Show an alert message
    BlendMode();


  }
  clearButton.onPress = function () { //When blendButton is pressed
    this.color = "#4ef542"; //Change button color
    //Show an alert message
    ClearButton();

  }

  shapeButton.onPress = function () {

    let colorData = {
      color: `${'#'+Math.floor(Math.random()*16777215).toString(16)}`,
    };
    this.color = colorData.color;
    player.forEach(shape => {
      shape.color = colorData.color;


      return false;
    });
    let colordata = {
      color: colorData.color,
      clientID: socket.id
    };
    socket.emit('colorData', colordata);
    console.log(colordata);
  }
}




function playerColor() {

}

function ClearButton() {
  var ClearData = {
    color: `${'#'+Math.floor(Math.random()*16777215).toString(16)}`,

  };
  clearButton.color = ClearData.color
  socket.emit('clearButton', ClearData);
  console.log(`${ClearData.color}`)
}

function BlendMode() {

  var BlendData = {
    mode: bModes[Math.floor(Math.random() * bModes.length)]
  };

  socket.emit('BlendButton', BlendData);
  console.log(`${BlendData.mode}`)
}
let spring = 0.05;
let gravity = 0.05;
let friction = -0.9;
var speedx = 1; //= Math.floor(Math.random() * -10)-1;
var speedY = 1; //= Math.floor(Math.random() * -10)-1;
var size = 200;
var color;


/// when a person comes in and clicks, add a
// shape that bounces around with a color tied to them
class shape {
  constructor(x, y, size, color, speedx, speedY, nickname, clicks, otherPlayers, player) {
    this.x = x;
    this.y = y;
    this.size = size;




    this.color = color;
    this.speedx = speedx;
    this.speedY = speedY;
    this.name = nickname;
    this.id = clicks;
    this.others = otherPlayers;
    this.player = player;

  }


  collide() { /// other players and player need to be tracked. 


    for (let i = this.id + 1; i < player.length; i++) {

      let dx = this.player[i].x - this.x;
      let dy = this.player[i].y - this.y;
      let distance = sqrt(dx * dx + dy * dy);
      let minDist = this.player[i].size + this.size;
      // console.log(dx);
      if (distance < minDist) {

        let angle = atan2(dy, dx);
        let targetX = this.x + cos(angle) * minDist;
        let targetY = this.y + sin(angle) * minDist;
        let ax = (targetX - this.player[i].x) * spring;
        let ay = (targetY - this.player[i].y) * spring;
        this.speedx -= ax;
        this.speedY -= ay;
        this.player[i].speedx += ax;
        this.player[i].speedY += ay;
      }

    }
    if (otherPlayers.length > 1) {

      for (let i = otherPlayers.id + 1; i < otherPlayers.length; i++) {

        let dx = this.otherPlayers[i].x - this.x;
        let dy = this.otherPlayers[i].y - this.y;
        let distance = sqrt(dx * dx + dy * dy);
        let minDist = this.otherPlayers[i].size / 2 + this.size / 2;
        // console.log(dx);
        if (distance < minDist) {
          console.log("2");
          let angle = atan2(dy, dx);
          let targetX = this.x + cos(angle) * minDist;
          let targetY = this.y + sin(angle) * minDist;
          let ax = (targetX - this.otherPlayers[i].x) * spring;
          let ay = (targetY - this.otherPlayers[i].y) * spring;
          this.vx -= ax;
          this.vy -= ay;
          this.otherPlayers[i].x += ax;
          this.otherPlayers[i].y += ay;
        }

      }

    }



  }

  move() {

    this.speedY += gravity;
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
    fill(this.color);






    // draw player
    ellipse(this.x, this.y, this.size);






    //style nickname

    stroke(0);
    strokeWeight(1);
    fill(250);


    // draw nickname
    textSize(5);
    text(`${nickname}`, this.x - 2, this.y);

  }
}