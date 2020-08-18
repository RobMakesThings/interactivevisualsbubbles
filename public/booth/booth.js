var socket;
var myButton;

let BGcolor = `${'#'+Math.floor(Math.random()*16777215).toString(16)}`

let clientID;
let otherPlayers = [];
let clientsConnected;
let clicks = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(100);
  // Start a socket connection to the server
  // Some day we would run this server somewhere else
  socket = io.connect();
  // We make a named event called 'mouse' and write an
  // anonymous callback function



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
      otherPlayers



    ));
    console.log(data.speedx);


  });


  // lets change the color after 10 clicks
//   socket.on('colorData', function (data) {
//     otherPlayers.forEach(shape => {
//       shape.color = data.color;
//     });
// console.log(data);
//   });
  myButton = new Clickable(); //Create button
  myButton.locate(100, 100); //Position Button
  myButton.onPress = function () { //When myButton is pressed
    this.color = "#AAAAFF"; //Change button color
    alert("Yay!"); //Show an alert message
  }
}

function draw() {
  // Nothing
  background(BGcolor);
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
  otherPlayers.forEach(shape => {
    shape.collide();
    shape.move();
    shape.show();
  });


}






let spring = 0.05;
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
    this.client = socket.id;

  }
  //stop moving to the right. 

  collide() { /// other otherPlayerss and otherPlayers need to be tracked. 
     //if (otherPlayers.length>2){
    for (let i = 1; i < this.others.length; i++) {
      //console.log(this.others[i].x );
      let dx = this.others[i].x - this.x;
      let dy = this.others[i].y - this.y;
      let distance = sqrt(dx * dx + dy * dy);
      let minDist = this.others[i].size/2 + this.size/2;

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
    if (this.x + this.size/2 > width) {
      this.x = width - this.size/2;
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






    // draw otherPlayers
    ellipse(this.x, this.y, this.size);






    //style nickname

    stroke(0);
    strokeWeight(1);
    fill(250);


    // draw nickname
    textSize(25);
    text(`${this.name}`, this.x - 2, this.y);

  }
}
















// class shape {
//   constructor(x, y, size, color,speedx,speedy){
//     this.x = x;
//     this.y = y;
//     this.size = size;
//     this.color = color;
//     this.speedx = speedx;
//     this.speedy = speedy;

//   }
//   collide(){

//     if (this.x>=windowWidth || this.x<this.size){
//       this.speedx*=-1
//     }
//     if (this.y>=windowHeight || this.y<this.size){
//       this.speedy*=-1
//     }
//   }

//   move(){

//   this.x+= this.speedx;
//   this.y+= this.speedy;
//   }

//   show(){
//   fill(this.color);
//   ellipse(this.x, this.y, this.size);
//   }
//   }