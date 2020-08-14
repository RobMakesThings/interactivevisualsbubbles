// ITP Networked Media, Fall 2014
// https://github.com/shiffman/itp-networked-media
// Daniel Shiffman

// Keep track of our socket connection
var socket;
let BGcolor = `${'#'+Math.floor(Math.random()*16777215).toString(16)}`
let spring = 0.05;
let gravity = 0.03;
let friction = -0.9;

var nickname = prompt('Enter a nickname');
// buttons using p5.clickable
var blendButton;
let bModes = []; 
var clearButton;

//player vars
var speedx = 1;
var speedy = 1;
var size ;
var color ;

let player = [];
let otherPlayers = [];
let clicks = 0;

var mojis = ["😀","😁","😂","🤣","😎","😄","😆","🤑","😠","🌍","🎉","👍","💎"] ;
let myMoji = mojis[Math.floor(Math.random()*mojis.length)];


function setup() {
  console.log(nickname);
  color = `${'#'+Math.floor(Math.random()*16777215).toString(16)}`;
  var myCanvas = createCanvas(windowWidth-50,windowHeight-100);
  myCanvas.parent("canvas");
  size = random(20,50);
  bModes =  [ADD,DARKEST,LIGHTEST,DIFFERENCE,EXCLUSION,MULTIPLY,BURN,BLEND];
  
  
  background(100  );
  // Start a socket connection to the server
  // Some day we would run this server somewhere else
  socket = io.connect('http://localhost:3000');
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

socket.on('playerData',function(data) {
  console.log("Got: " + data.x + " " + data.speedy);
  otherPlayers[data.clicks] = new shape(
    data.x,
    data.y,
    data.size,
    data.color,
    random(2,10),
    random(5,6)
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
function(BlendData){
    blendMode(`${BlendData.mode}`);
}
);
socket.on('clearButton',
function(ClearData){
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

function addShape(xpos, ypos,ClientEmoji) {
  // We are sending!
  console.log("sendmouse: " + xpos + " " + ypos+" "+`${myMoji}`);
  
  // Make a little object with  and y
  var data = {
    x: xpos,
    y: ypos,
    Emoji: myMoji,
  };

  // Send that object to the socket
  socket.emit('mouse',data);
}

function mousePressed(){
    
    console.log('thats a click');
    clicks++;
    player[clicks] = new shape(
      mouseX,
      mouseY,
      size,
      color,
      random(10,20)
    );
    let data = {
      x: mouseX,
      y: mouseY,
      size: size,
      color: color,
      speedx: speedx,
      speedy:speedy,
      clicks: clicks
    };
    socket.emit('playerData',data);
    console.log(data);
}


function buttons(){
  blendButton = new Clickable();     //Create button
  blendButton.locate(120
    , (windowHeight)-200);     
  blendButton.text = "Blend Mode"; //Position Button
  blendButton.color = "#03fcdb";
  clearButton = new Clickable();     //Create button
  clearButton.text = "Clear Canvas"; //Position Button
  clearButton.locate(240, windowHeight-200);     
  clearButton.color = "#03fcdb";
  
  ///
  blendButton.onPress = function(){  //When blendButton is pressed
    this.color = "#befc03";       //Change button color
               //Show an alert message
   BlendMode();
  
  }
  clearButton.onPress = function(){  //When blendButton is pressed
    this.color = "#4ef542";       //Change button color
               //Show an alert message
   ClearButton();
  
  }
}
function ClearButton(){
  var ClearData = {
    color: `${'#'+Math.floor(Math.random()*16777215).toString(16)}`,
  
};

socket.emit('clearButton',ClearData); 
    console.log(`${ClearData.color}`)
}

function BlendMode(){

  var BlendData = {
      mode:bModes[Math.floor(Math.random()*bModes.length)]
  };
  
      socket.emit('BlendButton',BlendData);
      console.log(`${BlendData.mode}`)
  }


/// when a person comes in and clicks, add a
// shape that bounces around with a color tied to them
class shape {
constructor(x, y, size, color,speedx,speedy, nickname){
  this.x = x;
  this.y = y;
  this.size = size;
  this.color = color;
  this.speedx = speedx;
  this.speedy = speedy;
  this.name = nickname;
  

}
collide(){
 
  if (this.x>=windowWidth || this.x<this.size){
    this.speedx*=-1
  }
  if (this.y>=windowHeight || this.y<this.size){
    this.speedy*=-1
  }
}

move(){

this.x+= this.speedx;
this.y+= this.speedy;
}

show(){
fill(this.color);
textSize(200);
ellipse(this.x, this.y, this.size);
text(this.name, this.x, this.y);

}
}