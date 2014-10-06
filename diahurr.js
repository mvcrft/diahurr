//Mostly cobbled together from the teachings at http://natureofcode.com
//vortex formula from http://en.wikipedia.org/wiki/Vortex
//also helpful: http://gamedevelopment.tutsplus.com/tutorials/adding-turbulence-to-a-particle-system--gamedev-13332

// Colin Sebestyen
// colin@movecraft.com

var agent,showLine,agentNum,gui,time,startTime = 2000,length = 1000,textAlpha = 150;

var agents = [];

//intial values for Mover Object
var initVals = function(){
	var initVal = new Object();
	initVal.velocity = createVector(random(1,initSpeed),random(1,initSpeed));
	initVal.scale = random(20,80);
	initVal.color = color(random(80,150),random(40,50),random(10,50));
	return initVal
}

guiVals = {
	//vortexSpeed
	hate: 20,
	//VortexSize
	jokes: 300,
	//showLine
	prescan: false,
}
;


function setup() {

//initalize agent values
agentNum = 100;
initSpeed = 5;

myCanvas = createCanvas(windowWidth, windowHeight);

//populate agents array with initial Movers
for (i = 0;i < agentNum;i++){
	//call the initVals function and return vals
	init = initVals();
	//push the mover objects to the array.
	agents.push(new Mover(init.velocity,init.color,init.scale,init.scale));
};

gui = new dat.GUI();
gui.add(guiVals,"hate",0,50);
gui.add(guiVals,"jokes",0,width);
gui.add(guiVals,"prescan");

};

function draw() {

  background(180);

for (i = 0;i < agents.length;i++){
	//draw the lines
	var myVortex = createVector(width/2,height/2);
	if (guiVals.prescan == true){
		stroke(200);
		color(50);
		line(myVortex.x,myVortex.y,agents[i].position.x,agents[i].position.y);
	};
	//draw the agents and assign functions
	agents[i].show();
	agents[i].move();
	agents[i].edgeWrap();
	agents[i].applyVortex();
};

//push and pop objects from agents array based on user input

if (mouseIsPressed){
	init = initVals();
	agents.push(new Mover(init.velocity,init.color,init.scale,init.scale));
};

	if (keyIsPressed === true){
		agents.pop();
	};

//update the agents
for (i = 0;i < agents.length;i++){
	agents[i].vortexSize = guiVals.hate;
	agents[i].vortexRotSpeed = guiVals.jokes;
};

//draw the instructions
time = millis(); // millseconds since the sketch began
var endTime = startTime + length; // time to end animation
textAlpha = map( time, startTime, endTime, 150, 0 );

s = "CLICK TO SPRAY. PRESS ANY KEY TO KILL.";
textSize(16);
fill(0,0,0,textAlpha);
textAlign(CENTER);
text(s,width/2,height/2,500,500);

};

//create Mover "class"

var Mover = function(velocity,color,scaleX,scaleY){
  this.position = createVector( 0, 0 );
  this.velocity = velocity;
  this.vortexPos = createVector(width/2,height/2);
  this.vortexRotSpeed = 30;
  this.vortexSize = 300;
  this.color = color;
  this.scaleX = scaleX;
  this.scaleY = scaleY;
};

//display the Mover. Choose a graphic. let's say... a circle?
Mover.prototype.show = function() {
	fill(this.color);
	noStroke();
	ellipse(this.position.x,this.position.y,this.scaleX,this.scaleY);
};

//movement
Mover.prototype.move = function(){
this.position.add(this.velocity);

}

//main vortex logic
Mover.prototype.applyVortex = function(){

//find the vector between Vortex Position and Mover
//var d = this.postion.sub(vortexPos);

var dx = this.position.x - this.vortexPos.x;
var dy = this.position.y - this.vortexPos.y;

//var v = createVector(-d.y * this.vortexRotSpeed,d.x*this.vortexRotSpeed);

// make a triangle
var vx = -dy*this.vortexRotSpeed;
var vy = dx*this.vortexRotSpeed;

//add some damping - standard inverse square equation
var factor = 1 / (1+(dx*dx+dy*dy)/this.vortexSize);

//add the new vortex into postion
this.position.x +=(vx-this.position.x) * factor;
this.position.y +=(vy-this.position.y) * factor;

};

//edgewrap when Movers move offscreen
Mover.prototype.edgeWrap = function () {
  if (this.position.x > width) {
    this.position.x = 0;
  } else if (this.position.x < 0) {
    this.position.x = width;
  }

  if (this.position.y > height) {
    this.position.y = 0;
  } else if (this.position.y < 0) {
    this.position.y = height;
  }
};

//Auto resize
window.onresize = function(){
  myCanvas.size(windowWidth, windowHeight);
}
