var renderer;
var sim;
var balls = [];
var numBalls = 500;
var height = 1000;
var width = 800;
var gravity = vec2.fromValues(0,1.0);
var dt = 0.1;

function Ball(){
	this.p = vec2.fromValues(Math.random()*width, Math.random()*height);
	this.v = vec2.fromValues(0,0);
  this.a = vec2.fromValues(0,0);
	this.r = 20;
	this.move = function(){
    vec2.add(this.v,this.v,vec2.scale(vec2.create(),this.a,dt*this.p[1]/10));
    vec2.add(this.p,this.p,vec2.scale(vec2.create(),this.v,dt));
    vec2.set(this.a,0,0);
	};
	this.draw = function(ctx){
		ctx.beginPath();
		ctx.arc(this.p[0],this.p[1],this.r,0,Math.PI*2);
		ctx.fill();
		ctx.stroke();
	}
}

function Simulation(){
  this.update = function(balls){
    for(var i = 0; i < balls.length; i++){
      vec2.add(balls[i].a, balls[i].a, gravity);
    }
    moveBalls(balls);
  }
  function moveBalls(balls){
    balls.forEach(function(ball){ ball.move(); })
  }
  function checkCollisions(balls){

  }
}

function startSim(){
	renderer = new Renderer(width, height);
	sim = new Simulation();
	for(var i=0; i< numBalls; i++){
		balls.push(new Ball());
	}
	animate();
}

function animate(){
	window.requestAnimationFrame(animate)
	sim.update(balls);
	renderer.drawBalls(balls);
};
