var renderer;
var sim;
var balls = [];
var numBalls = 50;

function Ball(){
	this.x = Math.random() *500;
	this.y = Math.random() *500;
	this.vx = 0;
	this.vy = 0;
	this.r = 8;
	this.move = function(){

	};
	this.draw = function(ctx){
		ctx.beginPath();
		ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
		ctx.fill();
		ctx.stroke();
	}
}

function Simulation(){
  this.moveBalls = function(balls){
    balls.forEach(function(ball){ ball.move(); })
  }
}

function startSim(){
	renderer = new Renderer();
	sim = new Simulation();
	for(var i=0; i< numBalls; i++){
		balls.push(new Ball());
	}
	animate();
}

function animate(){
	window.requestAnimationFrame(animate)
	sim.moveBalls(balls);
	renderer.drawBalls(balls);
};
