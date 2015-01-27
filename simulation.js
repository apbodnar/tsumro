var renderer;
var sim;
var balls = [];
var numBalls = 50;
var height = 800;
var width = 600;
var gravity = vec2.fromValues(0,2.0);
var dt = 0.1;
var r = 20;
var k = 10;

function Ball(){
	this.p = vec2.fromValues(Math.random()*(width-r*2)+r, Math.random()*(height-r*2)+r);
	this.v = vec2.fromValues(0,0);
  this.a = vec2.fromValues(0,0);
	this.move = function(){
    vec2.add(this.v,this.v,vec2.scale(vec2.create(),this.a,dt));
    var damper = 1-Math.atan(vec2.length(this.v)/10000)/(Math.PI/2);
    vec2.scale(this.v,this.v,damper);
    vec2.add(this.p,this.p,vec2.scale(vec2.create(),this.v,dt));
    vec2.set(this.a,0,0);
	};
	this.draw = function(ctx){
		ctx.beginPath();
		ctx.arc(this.p[0],this.p[1],r,0,Math.PI*2);
		ctx.fill();
		ctx.stroke();
	}
}

function Simulation(){
  this.update = function(balls){
  	addGravity(balls);
    checkCollisions(balls);
    moveBalls(balls);
  }
  function moveBalls(balls){
    balls.forEach(function(ball){ ball.move(); })
  }
  function checkCollisions(balls){
		checkBallCollisions(balls);
		checkBoundaryCollisions(balls);
  }
  function checkBallCollisions(balls){
  	for(var i=0; i<balls.length; i++){
  		for(var j=0; j<balls.length; j++){
  			if(i === j) continue;
  			var span = vec2.sub(vec2.create(),balls[i].p,balls[j].p);
  			var dist = vec2.length(span);
  			vec2.normalize(span,span);
  			if(dist < r*2){
  				var eq = r*2 - dist;
  				vec2.add(balls[i].a,balls[i].a,vec2.scale(vec2.create(),span,eq*k));
  				vec2.add(balls[j].a,balls[j].a,vec2.scale(vec2.create(),span,-eq*k));
  			}
  		}
  	}
  }
  function checkBoundaryCollisions(balls){
  	for(var i=0; i<balls.length; i++){
  		var x = balls[i].p[0];
  		var y = balls[i].p[1];
  		if(x <= r || x >= width-r){
				balls[i].v[0] *= -0.99;
			}
			if(y >= height-r){
				balls[i].v[1] = -Math.abs(balls[i].v[1]);
				balls[i].a[1] += ((height-r) - y)*k;
			}
  	}
  }
  function addGravity(balls){
    for(var i = 0; i < balls.length; i++){
      vec2.add(balls[i].a, balls[i].a, gravity);
    }
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
