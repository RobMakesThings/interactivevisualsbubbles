var socket;
var myButton;




let otherPlayers = [];



function setup() {
  createCanvas(windowWidth, windowHeight);
  background(100);
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
  console.log("Got: " + data.x + " " + data.y);
  otherPlayers[data.clicks] = new shape(
    data.x,
    data.y,
    data.size,
    data.color,
    random(10,20)
  );



});
socket.on('playerData',function(data) {
  console.log("Got: " + data.x + " " + data.speedy);
  otherPlayers[data.clicks] = new shape(
    data.x,
    data.y,
    data.size,
    data.color,
    random(10,20),
    random(10,20)
  );



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


}






class shape {
  constructor(x, y, size, color,speedx,speedy){
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.speedx = speedx;
    this.speedy = speedy;
  
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
  ellipse(this.x, this.y, this.size);
  }
  }