var socket;
var myButton;

let BGcolor = `${'#'+Math.floor(Math.random()*16777215).toString(16)}`


let otherPlayers = [];

let clicks = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(100);
  // Start a socket connection to the server
  // Some day we would run this server somewhere else
  socket = io.connect('/booth');
  // We make a named event called 'mouse' and write an
  // anonymous callback function
  socket.on('mouse',
    // When we receive data
    function(data) {
      console.log("Got: " + data.x + " " + data.y);
      // Draw a blue circle
      fill(0);
      //stroke(250);
      textSize(100);
      text(data.Emoji,data.x, data.y,);
    }
  );

// // socket.on('otherPlayersData',function(data) {
// //   console.log("Got: " + data.x + " " + data.y);
// //   otherotherPlayerss[data.clicks] = new shape(
// //     data.x,
// //     data.y,
// //     data.size,
// //     data.color,
// //     random(10,20)
// //   );



// });
socket.on('playerData',function(data) {
  
  otherPlayers[data.id] = new shape(
    data.x,
    data.y,
    data.size,
    data.color,
    data.speedx,
    data.speedY,
    data.nickname,
    data.id,
    otherPlayers,
    otherPlayers
    
  );
console.log(otherPlayers);


});

  myButton = new Clickable();     //Create button
myButton.locate(100, 100);        //Position Button
myButton.onPress = function(){  //When myButton is pressed
  this.color = "#AAAAFF";       //Change button color
  alert("Yay!");                //Show an alert message
}
}

function draw() {
  // Nothing
  background(BGcolor);
  socket.on('BlendButton',
  function(BlendData){
      blendMode(`${BlendData.mode}`);
  }
  );
  socket.on('clearButton',
  function(ClearData){
    BGcolor =ClearData.color
      background(`${ClearData.color}`);
  }
  );
  otherPlayers.forEach(shape => {
    shape.collide();
    shape.move();
    shape.show();
  });


}







let spring = 0.2;
  let gravity = 0.03;
  let friction = -0.9;
  

/// when a person comes in and clicks, add a
// shape that bounces around with a color tied to them
class shape {
constructor(x, y, size, color,speedx,speedy, nickname, clicks,otherPlayers){
  this.x = x;
  this.y = y;
  this.size = size;




  this.color = color;
  this.speedx = speedx;
  this.speedy = speedy;
  this.name = nickname;
  this.id = clicks;
  this.others = otherPlayers;

}


collide(){/// other otherPlayerss and otherPlayers need to be tracked. 
  for (let i = otherPlayers.id ; i< otherPlayers.length; i++){

    let dx = this.otherPlayers[i].x - this.x;
    let dy = this.otherPlayers[i].y - this.y;
    let distance = sqrt(dx * dx + dy * dy);
    let minDist = this.otherPlayers[i].size + this.size;
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

move(){
  
  this.speedy += gravity;
  this.x += this.speedx;
  this.y += this.speedy;
  if (this.x + this.size / 2 > width) {
    this.x = width - this.size / 2;
    this.speedx *= friction;
  } else if (this.x - this.size / 2 < 0) {
    this.x = this.size / 2;
    this.speedx *= friction;
  }
  if (this.y + this.size / 2 > height) {
    this.y = height - this.size / 2;
    this.speedy *= friction;
  } else if (this.y - this.size / 2 < 0) {
    this.y = this.size / 2;
    this.speedy *= friction;
  }
}


show(){
fill(this.color);






// draw otherPlayers
ellipse(this.x, this.y, this.size);






//style nickname

stroke(0);
strokeWeight(1);
fill(250);


// draw nickname
textSize(5);
//text(`${nickname}`, this.x-2, this.y);

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